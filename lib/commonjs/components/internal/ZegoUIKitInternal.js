"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _zegoExpressEngineReactnative = _interopRequireDefault(require("zego-express-engine-reactnative"));

const { Platform } = require("react-native");
var _logger = require("../../utils/logger");

var _ZegoChangedCountOrProperty = _interopRequireDefault(require("./ZegoChangedCountOrProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _isRoomConnected = false;
var _currentRoomState = 7; // Logout

var _currentRoomID = '';
var _audioOutputType = 0;
var _usingFrontFacingCamera = true;
var _onMicDeviceOnCallbackMap = {};
var _onCameraDeviceOnCallbackMap = {};
var _onRoomStateChangedCallbackMap = {};
var _onRequireNewTokenCallbackMap = {};
var _onUserJoinCallbackMap = {};
var _onUserLeaveCallbackMap = {};
var _onUserInfoUpdateCallbackMap = {};
var _onSoundLevelUpdateCallbackMap = {};
var _onSDKConnectedCallbackMap = {};
var _onAudioOutputDeviceTypeChangeCallbackMap = {};
var _onOnlySelfInRoomCallbackMap = {};
var _onUserCountOrPropertyChangedCallbackMap = {};
var _onAudioVideoAvailableCallbackMap = {};
var _onAudioVideoUnavailableCallbackMap = {};
var _onInRoomMessageReceivedCallbackMap = {};
var _onInRoomMessageSentCallbackMap = {};

var _localCoreUser = _createCoreUser('', '', '', {});

var _streamCoreUserMap = {}; // <streamID, CoreUser>

var _coreUserMap = {}; // <userID, CoreUser>

var _qualityUpdateLogCounter = 0;
var _inRoomMessageList = [];

function _resetData() {
  (0, _logger.zloginfo)('Reset all data.');
  _localCoreUser = _createCoreUser('', '', '', {});
  _streamCoreUserMap = {};
  _coreUserMap = {};
  _currentRoomID = '';
  _currentRoomState = 7;
  _isRoomConnected = false;
  _audioOutputType = 0;
  _inRoomMessageList = [];
}

function _resetDataForLeavingRoom() {
  (0, _logger.zloginfo)('Reset data for leaving room.');
  _streamCoreUserMap = {};
  _coreUserMap = {};
  _currentRoomID = '';
  _currentRoomState = 7;
  _isRoomConnected = false;
  const {
    userID,
    userName,
    profileUrl,
    extendInfo
  } = _localCoreUser;
  _localCoreUser = _createCoreUser(userID, userName, profileUrl, extendInfo);
  _coreUserMap[_localCoreUser.userID] = _localCoreUser;
  _inRoomMessageList = [];
}

function _createPublicUser(coreUser) {
  return {
    userID: coreUser.userID,
    userName: coreUser.userName,
    extendInfo: coreUser.extendInfo,
    isMicrophoneOn: coreUser.isMicDeviceOn,
    isCameraOn: coreUser.isCameraDeviceOn,
    soundLevel: coreUser.soundLevel
  };
}

function _createCoreUser(userID, userName, profileUrl, extendInfo) {
  return {
    userID: userID,
    userName: userName,
    profileUrl: profileUrl,
    extendInfo: extendInfo,
    viewID: -1,
    viewFillMode: 1,
    streamID: '',
    isMicDeviceOn: false,
    isCameraDeviceOn: false,
    publisherQuality: 0,
    soundLevel: 0,
    joinTime: 0
  };
}

function _isLocalUser(userID) {
  return userID === undefined || userID === '' || _localCoreUser.userID === userID;
}

function _setLocalUserInfo(userInfo) {
  _localCoreUser = _createCoreUser(userInfo.userID, userInfo.userName, userInfo.profileUrl, userInfo.extendInfo);
  _coreUserMap[userInfo.userID] = _localCoreUser;
}

function _onRoomUserUpdate(roomID, updateType, userList) {
  // No need for roomID, does not support multi-room right now.
  const userInfoList = [];

  if (updateType == 0) {
    userList.forEach(user => {
      if (!(user.userID in _coreUserMap)) {
        const coreUser = _createCoreUser(user.userID, user.userName);

        _coreUserMap[user.userID] = coreUser;
      }

      const streamID = _getStreamIDByUserID(user.userID);

      if (streamID in _streamCoreUserMap) {
        _coreUserMap[user.userID].streamID = streamID;
      }

      _coreUserMap[user.userID].joinTime = Date.now();

      _notifyUserInfoUpdate(_coreUserMap[user.userID]);

      userInfoList.push(_createPublicUser(_coreUserMap[user.userID])); // Start after user insert into list

      _tryStartPlayStream(user.userID);
    });

    _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.userAdd);

    (0, _logger.zloginfo)("User Join: ", userInfoList);
    Object.keys(_onUserJoinCallbackMap).forEach(callbackID => {
      if (_onUserJoinCallbackMap[callbackID]) {
        _onUserJoinCallbackMap[callbackID](userInfoList);
      }
    });
  } else {
    userList.forEach(user => {
      if (user.userID in _coreUserMap) {
        const coreUser = _coreUserMap[user.userID];
        const userInfo = {
          userID: coreUser.userID,
          userName: coreUser.userName,
          profileUrl: coreUser.profileUrl,
          extendInfo: coreUser.extendInfo
        };
        userInfoList.push(userInfo); // Stop play stream before remove user list

        _tryStopPlayStream(coreUser.userID, true);

        delete _coreUserMap[user.userID];
      }
    });

    _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.userDelete);

    (0, _logger.zloginfo)("User Leave: ", userInfoList);
    Object.keys(_onUserLeaveCallbackMap).forEach(callbackID => {
      if (_onUserLeaveCallbackMap[callbackID]) {
        _onUserLeaveCallbackMap[callbackID](userInfoList);
      }
    });

    if (Object.keys(_coreUserMap).length <= 1) {
      Object.keys(_onOnlySelfInRoomCallbackMap).forEach(callbackID => {
        if (_onOnlySelfInRoomCallbackMap[callbackID]) {
          _onOnlySelfInRoomCallbackMap[callbackID]();
        }
      });
    }
  }
}

function _onRoomStreamUpdate(roomID, updateType, streamList) {
  (0, _logger.zloginfo)('_onRoomStreamUpdate: ', roomID, updateType, streamList);
  var users = [];

  if (updateType == 0) {
    // Add
    streamList.forEach(stream => {
      const userID = stream.user.userID;
      const userName = stream.user.userName;
      const streamID = stream.streamID;

      if (userID in _coreUserMap) {
        _coreUserMap[userID].streamID = streamID;
        _streamCoreUserMap[streamID] = _coreUserMap[userID];

        _notifyUserInfoUpdate(_coreUserMap[userID]);

        _tryStartPlayStream(userID);

        users.push(_coreUserMap[userID]);
      } else {
        _streamCoreUserMap[streamID] = _createCoreUser(userID, userName, '', {});
        _streamCoreUserMap[streamID].streamID = streamID;
        _coreUserMap[userID] = _streamCoreUserMap[streamID];
        users.push(_streamCoreUserMap[streamID]);
      }
    });
    Object.keys(_onAudioVideoAvailableCallbackMap).forEach(callbackID => {
      if (_onAudioVideoAvailableCallbackMap[callbackID]) {
        _onAudioVideoAvailableCallbackMap[callbackID](users);
      }
    });
  } else {
    streamList.forEach(stream => {
      const userID = stream.user.userID;
      const streamID = stream.streamID;

      if (userID in _coreUserMap) {
        _tryStopPlayStream(userID, true);

        _coreUserMap[userID].isCameraDeviceOn = false;
        _coreUserMap[userID].isMicDeviceOn = false;
        _coreUserMap[userID].streamID = '';

        _notifyUserInfoUpdate(_coreUserMap[userID]);

        users.push(_coreUserMap[userID]);
        delete _streamCoreUserMap[streamID];
      }
    });

    _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.cameraStateUpdate);

    Object.keys(_onAudioVideoUnavailableCallbackMap).forEach(callbackID => {
      if (_onAudioVideoUnavailableCallbackMap[callbackID]) {
        _onAudioVideoUnavailableCallbackMap[callbackID](users);
      }
    });
  }
}

function _onRemoteCameraStateUpdate(userID, state) {
  console.warn('>>>>>>>>>>>>> _onRemoteCameraStateUpdate', userID, state);

  if (userID in _coreUserMap) {
    const isOn = state == 0; // 0 for Open

    _coreUserMap[userID].isCameraDeviceOn = isOn;

    _notifyUserInfoUpdate(_coreUserMap[userID]);

    _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.cameraStateUpdate);

    Object.keys(_onCameraDeviceOnCallbackMap).forEach(callbackID => {
      if (_onCameraDeviceOnCallbackMap[callbackID]) {
        _onCameraDeviceOnCallbackMap[callbackID](userID, isOn);
      }
    });

    if (userID != _localCoreUser.userID) {
      if (isOn) {
        _tryStartPlayStream(userID);
      }
    }
  }
}

function _onAudioRouteChange(type) {
  Object.keys(_onAudioOutputDeviceTypeChangeCallbackMap).forEach(callbackID => {
    if (_onAudioOutputDeviceTypeChangeCallbackMap[callbackID]) {
      _onAudioOutputDeviceTypeChangeCallbackMap[callbackID](type);
    }
  });
  _audioOutputType = type;
}

function _onRemoteMicStateUpdate(userID, state) {
  console.warn('>>>>>>>>>>>>> _onRemoteMicStateUpdate', userID, state);

  if (userID in _coreUserMap) {
    const isOn = state == 0; // 0 for Open

    _coreUserMap[userID].isMicDeviceOn = isOn;

    _notifyUserInfoUpdate(_coreUserMap[userID]);

    _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.microphoneStateUpdate);

    Object.keys(_onMicDeviceOnCallbackMap).forEach(callbackID => {
      if (_onMicDeviceOnCallbackMap[callbackID]) {
        _onMicDeviceOnCallbackMap[callbackID](userID, isOn);
      }
    });

    if (userID != _localCoreUser.userID) {
      if (isOn) {
        _tryStartPlayStream(userID);
      }
    }
  }
}

function _onRoomStateChanged(roomID, reason, errorCode, extendedData) {
  (0, _logger.zloginfo)('Room state chaged: ', roomID, reason, errorCode, extendedData); // Not support multi-room right now

  if (reason == 1 || reason == 4) {
    // Logined || Reconnected
    _isRoomConnected = true;

    _tryStartPublishStream();
  } else {
    _isRoomConnected = false;
  }

  _currentRoomState = reason;
  Object.keys(_onRoomStateChangedCallbackMap).forEach(callbackID => {
    // callback may remove from map during room state chaging
    if (callbackID in _onRoomStateChangedCallbackMap) {
      if (_onRoomStateChangedCallbackMap[callbackID]) {
        _onRoomStateChangedCallbackMap[callbackID](reason, errorCode, extendedData);
      }
    }
  });
}

function _onInRoomMessageReceived(roomID, messageList) {
  (0, _logger.zloginfo)('Received in room message: ', roomID, messageList.length);
  var messages = [];
  messageList.forEach(msg => {
    const message = {
      message: msg.message,
      messageID: msg.messageID,
      sendTime: msg.sendTime,
      sender: _createPublicUser(_coreUserMap[msg.fromUser.userID])
    };
    messages.push(message);

    _inRoomMessageList.push(message);
  });
  Object.keys(_onInRoomMessageReceivedCallbackMap).forEach(callbackID => {
    // callback may remove from map during room state chaging
    if (callbackID in _onInRoomMessageReceivedCallbackMap) {
      if (_onInRoomMessageReceivedCallbackMap[callbackID]) {
        _onInRoomMessageReceivedCallbackMap[callbackID](messages);
      }
    }
  });
}

function _onRequireNewToken() {
  Object.keys(_onRequireNewTokenCallbackMap).forEach(callbackID => {
    if (callbackID in _onRequireNewTokenCallbackMap) {
      if (_onRequireNewTokenCallbackMap[callbackID]) {
        const token = _onRequireNewTokenCallbackMap[callbackID]();

        if (token) {
          _zegoExpressEngineReactnative.default.instance().renewToken(_currentRoomID, token).then(() => {
            resolve();
          }).catch(error => {
            (0, _logger.zlogerror)('Renew token failed: ', error);
            reject(error);
          });
        } else {
          (0, _logger.zlogerror)('Renew token failed: the returned token is abnormal');
        }
      }
    }
  });
}

function _registerEngineCallback() {
  (0, _logger.zloginfo)('Register callback for ZegoExpressEngine...');

  _zegoExpressEngineReactnative.default.instance().on('roomUserUpdate', (roomID, updateType, userList) => {
    (0, _logger.zloginfo)('[roomUserUpdate callback]', roomID, updateType, userList);

    _onRoomUserUpdate(roomID, updateType, userList);
  });

  _zegoExpressEngineReactnative.default.instance().on('roomStreamUpdate', (roomID, updateType, streamList) => {
    (0, _logger.zloginfo)('[roomStreamUpdate callback]', roomID, updateType, streamList);

    _onRoomStreamUpdate(roomID, updateType, streamList);
  });

  _zegoExpressEngineReactnative.default.instance().on('publisherQualityUpdate', (streamID, quality) => {
    if (_qualityUpdateLogCounter % 10 == 0) {
      _qualityUpdateLogCounter = 0;
      (0, _logger.zloginfo)('[publisherQualityUpdate callback]', streamID, quality);
    }

    _qualityUpdateLogCounter++;

    if (streamID.split('_')[2] === 'main') {
      _localCoreUser.publisherQuality = quality;
      _coreUserMap[_localCoreUser.userID].publisherQuality = quality;

      _notifyUserInfoUpdate(_coreUserMap[_localCoreUser.userID]);
    }
  }); // ZegoExpressEngine.instance().on(
  //     'publisherStateUpdate',
  //     (streamID, state, errorCode, extendedData) => {
  //         zloginfo('publisherStateUpdate#################', streamID, state, errorCode)
  //     },
  // );


  _zegoExpressEngineReactnative.default.instance().on('playerQualityUpdate', (streamID, quality) => {
    if (_qualityUpdateLogCounter % 10 == 0) {
      (0, _logger.zloginfo)('[playerQualityUpdate callback]', streamID, quality);
    } // TODO

  });

  _zegoExpressEngineReactnative.default.instance().on('remoteCameraStateUpdate', (streamID, state) => {
    (0, _logger.zloginfo)('[remoteCameraStateUpdate callback]', streamID, state);

    _onRemoteCameraStateUpdate(_getUserIDByStreamID(streamID), state);
  });

  _zegoExpressEngineReactnative.default.instance().on('remoteMicStateUpdate', (streamID, state) => {
    (0, _logger.zloginfo)('[remoteMicStateUpdate callback]', streamID, state);

    _onRemoteMicStateUpdate(_getUserIDByStreamID(streamID), state);
  });

  _zegoExpressEngineReactnative.default.instance().on('playerStateUpdate', (streamID, state, errorCode, extendedData) => {
    (0, _logger.zloginfo)('[playerStateUpdate callback]', streamID, state, errorCode, extendedData);
  });

  _zegoExpressEngineReactnative.default.instance().on('remoteSoundLevelUpdate', soundLevels => {
    // {streamID, soundLavel} value from 0.0 to 100.0
    // zloginfo('[remoteSoundLevelUpdate callback]', soundLevels);
    Object.keys(soundLevels).forEach(streamID => {
      const userID = _getUserIDByStreamID(streamID);

      if (userID in _coreUserMap) {
        _coreUserMap[userID].soundLevel = soundLevels[streamID];

        _notifySoundLevelUpdate(userID, soundLevels[streamID]);
      }
    });
  });

  _zegoExpressEngineReactnative.default.instance().on('capturedSoundLevelUpdate', soundLevel => {
    if (_localCoreUser.userID === "" || !(_localCoreUser.userID in _coreUserMap)) {
      return;
    }

    _localCoreUser.soundLevel = soundLevel;
    _coreUserMap[_localCoreUser.userID].soundLevel = soundLevel;

    _notifySoundLevelUpdate(_localCoreUser.userID, soundLevel); // zloginfo('capturedSoundLevelUpdate', soundLevel)

  }); // https://doc-en-api.zego.im/ReactNative/enums/_zegoexpressdefines_.zegoroomstatechangedreason.html


  _zegoExpressEngineReactnative.default.instance().on('roomStateChanged', (roomID, reason, errorCode, extendedData) => {
    (0, _logger.zloginfo)('[roomStateChanged callback]', roomID, reason, errorCode, extendedData);

    _onRoomStateChanged(roomID, reason, errorCode, extendedData);
  });

  _zegoExpressEngineReactnative.default.instance().on('audioRouteChange', audioRoute => {
    (0, _logger.zloginfo)('[audioRouteChange callback]', audioRoute);

    _onAudioRouteChange(audioRoute);
  });

  _zegoExpressEngineReactnative.default.instance().on('IMRecvBroadcastMessage', (roomID, messageList) => {
    _onInRoomMessageReceived(roomID, messageList);
  });

  _zegoExpressEngineReactnative.default.instance().on('roomTokenWillExpire', (roomID, remainTimeInSecond) => {
    _onRequireNewToken();
  });
}

function _unregisterEngineCallback() {
  (0, _logger.zloginfo)('Unregister callback from ZegoExpressEngine...');

  _zegoExpressEngineReactnative.default.instance().off('roomUserUpdate');

  _zegoExpressEngineReactnative.default.instance().off('roomStreamUpdate');

  _zegoExpressEngineReactnative.default.instance().off('publisherQualityUpdate');

  _zegoExpressEngineReactnative.default.instance().off('playerQualityUpdate');

  _zegoExpressEngineReactnative.default.instance().off('remoteCameraStateUpdate');

  _zegoExpressEngineReactnative.default.instance().off('remoteMicStateUpdate');

  _zegoExpressEngineReactnative.default.instance().off('playerStateUpdate');

  _zegoExpressEngineReactnative.default.instance().off('remoteSoundLevelUpdate');

  _zegoExpressEngineReactnative.default.instance().off('capturedSoundLevelUpdate');

  _zegoExpressEngineReactnative.default.instance().off('roomStateChanged');

  _zegoExpressEngineReactnative.default.instance().off('audioRouteChange');

  _zegoExpressEngineReactnative.default.instance().off('IMRecvBroadcastMessage');
}

function _notifyUserCountOrPropertyChanged(type) {
  const msg = ["", "user add", "user delete", "mic update", "camera update"];
  const userList = Object.values(_coreUserMap).sort((user1, user2) => {
    return user2.joinTime - user1.joinTime;
  }).map(user => _createPublicUser(user));
  (0, _logger.zloginfo)(`_notifyUserCountOrPropertyChanged ${msg[type]}`, userList);
  Object.keys(_onUserCountOrPropertyChangedCallbackMap).forEach(callbackID => {
    if (_onUserCountOrPropertyChangedCallbackMap[callbackID]) {
      _onUserCountOrPropertyChangedCallbackMap[callbackID](JSON.parse(JSON.stringify(userList)));
    }
  });
} // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Stream Handling <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


function _getUserIDByStreamID(streamID) {
  // StreamID format: roomid_userid_main
  for (const userID in _coreUserMap) {
    if (_coreUserMap[userID].streamID == streamID) {
      return userID;
    }
  }

  return '';
}

function _getPublishStreamID() {
  return _currentRoomID + '_' + _localCoreUser.userID + '_main';
}

function _getStreamIDByUserID(userID) {
  return _currentRoomID + '_' + userID + '_main';
}

function _tryStartPublishStream() {
  if (_localCoreUser.isMicDeviceOn || _localCoreUser.isCameraDeviceOn) {
    (0, _logger.zloginfo)('_tryStartPublishStream', _localCoreUser.isMicDeviceOn, _localCoreUser.isCameraDeviceOn, _localCoreUser.streamID);

    if (!_localCoreUser.streamID) {
      return;
    }

    _zegoExpressEngineReactnative.default.instance().startPublishingStream(_localCoreUser.streamID).then(() => {
      if (_localCoreUser.streamID in _streamCoreUserMap) {
        _streamCoreUserMap[_localCoreUser.streamID] = _localCoreUser;
        Object.keys(_onAudioVideoAvailableCallbackMap).forEach(callbackID => {
          if (_onAudioVideoAvailableCallbackMap[callbackID]) {
            _onAudioVideoAvailableCallbackMap[callbackID]([_localCoreUser]);
          }
        });
      }
    });

    (0, _logger.zloginfo)('ZegoExpressEngine startPreview:', _localCoreUser);

    if (_localCoreUser.viewID > 0) {
      _zegoExpressEngineReactnative.default.instance().startPreview({
        'reactTag': _localCoreUser.viewID,
        'viewMode': _localCoreUser.fillMode,
        'backgroundColor': 0
      }).catch(error => {
        (0, _logger.zlogerror)(error);
      });
    }
  }
}

function _tryStopPublishStream() {
  let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (!_localCoreUser.isMicDeviceOn && !_localCoreUser.isCameraDeviceOn) {
    (0, _logger.zloginfo)('stopPublishStream');

    _zegoExpressEngineReactnative.default.instance().stopPublishingStream();

    _zegoExpressEngineReactnative.default.instance().stopPreview();

    if (_localCoreUser.streamID in _streamCoreUserMap) {
      delete _streamCoreUserMap[_localCoreUser.streamID];
      Object.keys(_onAudioVideoUnavailableCallbackMap).forEach(callbackID => {
        if (_onAudioVideoUnavailableCallbackMap[callbackID]) {
          _onAudioVideoUnavailableCallbackMap[callbackID]([_localCoreUser]);
        }
      });
    }
  }
}

function _tryStartPlayStream(userID) {
  if (userID in _coreUserMap) {
    const user = _coreUserMap[userID];
    (0, _logger.zloginfo)('_tryStartPlayStream: ', user);

    if (user.streamID !== '') {
      if (user.viewID > 0) {
        _zegoExpressEngineReactnative.default.instance().startPlayingStream(user.streamID, {
          'reactTag': user.viewID,
          'viewMode': user.fillMode,
          'backgroundColor': 0
        });
      } else {
        _zegoExpressEngineReactnative.default.instance().startPlayingStream(user.streamID);
      }
    }
  }
}

function _tryStopPlayStream(userID) {
  let force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (userID in _coreUserMap) {
    const user = _coreUserMap[userID];

    if (force || !user.isMicDeviceOn && !user.isCameraDeviceOn) {
      _zegoExpressEngineReactnative.default.instance().stopPlayingStream(user.streamID);
    }
  }
}

function _notifyUserInfoUpdate(userInfo) {
  Object.keys(_onUserInfoUpdateCallbackMap).forEach(callbackID => {
    if (_onUserInfoUpdateCallbackMap[callbackID]) {
      _onUserInfoUpdateCallbackMap[callbackID](userInfo);
    }
  });
}

function _notifySoundLevelUpdate(userID, soundLevel) {
  Object.keys(_onSoundLevelUpdateCallbackMap).forEach(callbackID => {
    if (_onSoundLevelUpdateCallbackMap[callbackID]) {
      _onSoundLevelUpdateCallbackMap[callbackID](userID, soundLevel);
    }
  });
}

var _default = {
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Internal <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  isRoomConnected() {
    return _isRoomConnected;
  },

  updateRenderingProperty(userID, viewID, fillMode) {
    (0, _logger.zloginfo)('updateRenderingProperty: ', userID, viewID, fillMode, '<<<<<<<<<<<<<<<<<<<<<<<<<<');

    if (userID === undefined) {
      (0, _logger.zlogwarning)('updateRenderingProperty: ignore undifine useid. Use empty string for local user.');
      return;
    }

    if (userID === '') {
      userID = _localCoreUser.userID;
    }

    if (userID in _coreUserMap) {
      _coreUserMap[userID].viewID = viewID;
      _coreUserMap[userID].fillMode = fillMode;

      _notifyUserInfoUpdate(_coreUserMap[userID]);

      if (_localCoreUser.userID == userID) {
        _localCoreUser.viewID = viewID;
        _localCoreUser.fillMode = fillMode;

        if (viewID > 0) {
          _tryStartPublishStream();
        } else {
          _tryStopPublishStream();
        }
      } else {
        // Check if stream is ready to play for remote user
        if (viewID > 0) {
          _tryStartPlayStream(userID);
        }
      }
    }
  },

  onUserInfoUpdate(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onUserInfoUpdateCallbackMap) {
        (0, _logger.zloginfo)('[onUserInfoUpdate] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onUserInfoUpdateCallbackMap[callbackID];
      }
    } else {
      _onUserInfoUpdateCallbackMap[callbackID] = callback;
    }
  },

  onSoundLevelUpdate(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onSoundLevelUpdateCallbackMap) {
        (0, _logger.zloginfo)('[onSoundLevelUpdate] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onSoundLevelUpdateCallbackMap[callbackID];
      }
    } else {
      _onSoundLevelUpdateCallbackMap[callbackID] = callback;
    }
  },

  onSDKConnected(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onSDKConnectedCallbackMap) {
        (0, _logger.zloginfo)('[onSDKConnected] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onSDKConnectedCallbackMap[callbackID];
      }
    } else {
      _onSDKConnectedCallbackMap[callbackID] = callback;
    }
  },

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SDK <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  connectSDK(appID, appSign, userInfo) {
    return new Promise((resolve, reject) => {
      // set advancedConfig to monitor remote user's device changed
      let object = {
        advancedConfig: {
          'notify_remote_device_unknown_status': 'true',
          'notify_remote_device_init_status': 'true'
        },
      }
      if(Platform.OS === 'android'){
        object.logConfig = null
      }
      _zegoExpressEngineReactnative.default.setEngineConfig(
      object);

      const engineProfile = {
        appID: appID,
        appSign: appSign,
        scenario: 0
      };

      _zegoExpressEngineReactnative.default.createEngineWithProfile(engineProfile).then(engine => {
        (0, _logger.zloginfo)('Create ZegoExpressEngine succeed!');

        _unregisterEngineCallback();

        _registerEngineCallback();

        _setLocalUserInfo(userInfo);

        Object.keys(_onSDKConnectedCallbackMap).forEach(callbackID => {
          // TODO cause  WARN  Possible Unhandled Promise Rejection (id: 56)
          if (_onSDKConnectedCallbackMap[callbackID]) {
            _onSDKConnectedCallbackMap[callbackID]();
          }
        });
        resolve();
      }).catch(error => {
        (0, _logger.zlogerror)('Create ZegoExpressEngine Failed: ', error);
        reject(error);
      });
    });
  },

  disconnectSDK() {
    return new Promise((resolve, reject) => {
      if (_zegoExpressEngineReactnative.default.instance()) {
        _zegoExpressEngineReactnative.default.destroyEngine().then(() => {
          (0, _logger.zloginfo)('Destroy ZegoExpressEngine finished!');
          resolve();
        }).catch(error => {
          (0, _logger.zlogerror)('Destroy ZegoExpressEngine failed!', error);
          reject(error);
        }).finally(() => {
          _resetData();
        });
      } else {
        resolve();
      }
    });
  },

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Audio Video <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  useFrontFacingCamera(isFrontFacing) {
    (0, _logger.zloginfo)('Use front facing camera: ', isFrontFacing);
    _usingFrontFacingCamera = isFrontFacing;
    return _zegoExpressEngineReactnative.default.instance().useFrontCamera(isFrontFacing, 0);
  },

  isUsingFrontFacingCamera() {
    return _usingFrontFacingCamera;
  },

  isMicDeviceOn(userID) {
    if (!userID) {
      return _localCoreUser.isMicDeviceOn;
    } else if (userID in _coreUserMap) {
      return _coreUserMap[userID].isMicDeviceOn;
    } else {
      (0, _logger.zlogwarning)('Can not check mic device is on for user[', userID, '], because no record!');
      return true;
    }
  },

  isCameraDeviceOn(userID) {
    if (!userID) {
      return _localCoreUser.isCameraDeviceOn;
    } else if (userID in _coreUserMap) {
      return _coreUserMap[userID].isCameraDeviceOn;
    } else {
      (0, _logger.zlogwarning)('No record for user: ', userID, '. Can not check camera device is on.');
      return true;
    }
  },

  enableSpeaker(enable) {
    // TODO
    return new Promise((resolve, reject) => {
      if (!_isRoomConnected) {
        (0, _logger.zlogerror)('You are not connect to any room.');
        reject();
      } else {
        _zegoExpressEngineReactnative.default.instance().muteSpeaker(!enable);

        resolve();
      }
    });
  },

  audioOutputDeviceType() {
    return _audioOutputType;
  },

  turnMicDeviceOn(userID, on) {
    return new Promise((resolve, reject) => {
      if (_isLocalUser(userID)) {
        (0, _logger.zloginfo)('turnMicDeviceOn: ', _localCoreUser.userID, on);

        _zegoExpressEngineReactnative.default.instance().muteMicrophone(!on);

        _onRemoteMicStateUpdate(_localCoreUser.userID, on ? 0 : 10); // 0 for open, 10 for mute


        _localCoreUser.isMicDeviceOn = on;
        _coreUserMap[_localCoreUser.userID].isMicDeviceOn = on;

        _notifyUserInfoUpdate(_localCoreUser);

        _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.microphoneStateUpdate);

        if (on) {
          _tryStartPublishStream();
        } else {
          _tryStopPublishStream();
        }

        resolve();
      } else {
        // TODO
        (0, _logger.zlogwarning)("Can not turn on other's mic device on this version");
        reject();
      }
    });
  },

  turnCameraDeviceOn(userID, on) {
    return new Promise((resolve, reject) => {
      if (_isLocalUser(userID)) {
        // Default to Main Channel
        (0, _logger.zloginfo)('turnCameraDeviceOn: ', _localCoreUser.userID, on);

        _zegoExpressEngineReactnative.default.instance().enableCamera(on, 0);

        _onRemoteCameraStateUpdate(_localCoreUser.userID, on ? 0 : 10); // 0 for open, 10 for mute


        _localCoreUser.isCameraDeviceOn = on; // if (!on) {
        //     _localCoreUser.viewID = -1;
        // }

        _coreUserMap[_localCoreUser.userID] = _localCoreUser;

        _notifyUserInfoUpdate(_localCoreUser);

        _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.cameraStateUpdate);

        if (on) {
          _tryStartPublishStream();
        } else {
          _tryStopPublishStream();
        }

        resolve();
      } else {
        // TODO
        (0, _logger.zlogwarning)("Can not turn on other's camera device on this version");
        reject();
      }
    });
  },

  onMicDeviceOn(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onMicDeviceOnCallbackMap) {
        (0, _logger.zloginfo)('[onMicDeviceOn] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onMicDeviceOnCallbackMap[callbackID];
      }
    } else {
      _onMicDeviceOnCallbackMap[callbackID] = callback;
    }
  },

  onCameraDeviceOn(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onCameraDeviceOnCallbackMap) {
        (0, _logger.zloginfo)('[onCameraDeviceOn] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onCameraDeviceOnCallbackMap[callbackID];
      }
    } else {
      _onCameraDeviceOnCallbackMap[callbackID] = callback;
    }
  },

  setAudioOutputToSpeaker(isSpeaker) {
    _zegoExpressEngineReactnative.default.instance().setAudioRouteToSpeaker(isSpeaker);
  },

  onAudioOutputDeviceTypeChange(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onAudioOutputDeviceTypeChangeCallbackMap) {
        (0, _logger.zloginfo)('[onAudioOutputDeviceTypeChange] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onAudioOutputDeviceTypeChangeCallbackMap[callbackID];
      }
    } else {
      _onAudioOutputDeviceTypeChangeCallbackMap[callbackID] = callback;
    }
  },

  setAudioConfig(config) {// TODO
  },

  setVideoConfig(config) {// TODO
  },

  onAudioVideoAvailable(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onAudioVideoAvailableCallbackMap) {
        (0, _logger.zloginfo)('[onAudioVideoAvailable] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onAudioVideoAvailableCallbackMap[callbackID];
      }
    } else {
      _onAudioVideoAvailableCallbackMap[callbackID] = callback;
    }
  },

  onAudioVideoUnavailable(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onAudioVideoUnavailableCallbackMap) {
        (0, _logger.zloginfo)('[onAudioVideoUnavailable] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onAudioVideoUnavailableCallbackMap[callbackID];
      }
    } else {
      _onAudioVideoUnavailableCallbackMap[callbackID] = callback;
    }
  },

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Room <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  joinRoom(roomID, token) {
    return new Promise((resolve, reject) => {
      const user = {
        userID: _localCoreUser.userID,
        userName: _localCoreUser.userName
      };
      const config = {
        isUserStatusNotify: true
      };
      token && (config.token = token);
      _currentRoomID = roomID;

      _zegoExpressEngineReactnative.default.instance().loginRoom(roomID, user, config).then(() => {
        (0, _logger.zloginfo)('Join room success.', user);

        _zegoExpressEngineReactnative.default.instance().startSoundLevelMonitor();

        _localCoreUser.streamID = _getPublishStreamID();
        _coreUserMap[_localCoreUser.userID] = _localCoreUser;

        _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.userAdd);

        resolve();
      }).catch(error => {
        (0, _logger.zlogerror)('Join room falied: ', error);
        _currentRoomID = '';
        reject(error);
      });
    });
  },

  leaveRoom() {
    return new Promise((resolve, reject) => {
      if (_currentRoomID == '') {
        (0, _logger.zlogwarning)('You are not join in any room, no need to leave room.');
        resolve();
      } else {
        (0, _logger.zloginfo)('leaveRoom: ', _currentRoomID);

        _zegoExpressEngineReactnative.default.instance().logoutRoom(_currentRoomID).then(() => {
          (0, _logger.zloginfo)('Leave room succeed.');

          _zegoExpressEngineReactnative.default.instance().stopSoundLevelMonitor();

          _notifyUserCountOrPropertyChanged(_ZegoChangedCountOrProperty.default.userDelete);

          _resetDataForLeavingRoom();

          resolve();
        }).catch(error => {
          (0, _logger.zlogerror)('Leave room failed: ', error);
          reject(error);
        });
      }
    });
  },

  onRoomStateChanged(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onRoomStateChangedCallbackMap) {
        (0, _logger.zloginfo)('[onRoomStateChanged] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onRoomStateChangedCallbackMap[callbackID];
      }
    } else {
      _onRoomStateChangedCallbackMap[callbackID] = callback;
    }
  },

  onRequireNewToken(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onRequireNewTokenCallbackMap) {
        (0, _logger.zloginfo)('[onRequireNewToken] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onRequireNewTokenCallbackMap[callbackID];
      }
    } else {
      _onRequireNewTokenCallbackMap[callbackID] = callback;
    }
  },

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> User <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  connectUser(userID, userName) {
    _setLocalUserInfo({
      userID: userID,
      userName: userName
    }); // TODO ZIM login

  },

  disconnectUser() {
    delete _coreUserMap[_localCoreUser.userID];
    _localCoreUser = _createCoreUser('', '', '', {}); // TODO ZIM logout
  },

  getLocalUserInfo() {
    return _localCoreUser;
  },

  getUser(userID) {
    return _coreUserMap[userID];
  },

  getAllUsers() {
    const users = Object.values(_coreUserMap);
    users.sort((a, b) => {
      return a.joinTime > b.joinTime;
    });
    var publicUsers = [];
    users.forEach(user => {
      publicUsers.push(_createPublicUser(user));
    });
    return publicUsers;
  },

  onUserJoin(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onUserJoinCallbackMap) {
        (0, _logger.zloginfo)('[onUserJoin] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onUserJoinCallbackMap[callbackID];
      }
    } else {
      _onUserJoinCallbackMap[callbackID] = callback;
    }
  },

  onUserLeave(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onUserLeaveCallbackMap) {
        (0, _logger.zloginfo)('[onUserLeave] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onUserLeaveCallbackMap[callbackID];
      }
    } else {
      _onUserLeaveCallbackMap[callbackID] = callback;
    }
  },

  onOnlySelfInRoom(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onOnlySelfInRoomCallbackMap) {
        (0, _logger.zloginfo)('[onOnlySelfInRoom] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onOnlySelfInRoomCallbackMap[callbackID];
      }
    } else {
      _onOnlySelfInRoomCallbackMap[callbackID] = callback;
    }
  },

  onUserCountOrPropertyChanged(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onUserCountOrPropertyChangedCallbackMap) {
        (0, _logger.zloginfo)('[onUserCountOrPropertyChanged] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onUserCountOrPropertyChangedCallbackMap[callbackID];
      }
    } else {
      _onUserCountOrPropertyChangedCallbackMap[callbackID] = callback;
    }
  },

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Message <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  getInRoomMessages() {
    return _inRoomMessageList;
  },

  sendInRoomMessage(message) {
    return new Promise((resolve, reject) => {
      _zegoExpressEngineReactnative.default.instance().sendBroadcastMessage(_currentRoomID, message).then(result => {
        (0, _logger.zloginfo)('SendInRoomMessage finished.', result);
        const {
          errorCode,
          messageID
        } = result;

        if (errorCode > 0) {
          reject(errorCode);
        } else {
          const inRoomMessage = {
            message: message,
            messageID: messageID,
            sendTime: Date.now(),
            sender: _createPublicUser(_localCoreUser)
          };

          _inRoomMessageList.push(inRoomMessage);

          Object.keys(_onInRoomMessageSentCallbackMap).forEach(callbackID => {
            // callback may remove from map during room state chaging
            if (callbackID in _onInRoomMessageSentCallbackMap) {
              if (_onInRoomMessageSentCallbackMap[callbackID]) {
                _onInRoomMessageSentCallbackMap[callbackID](errorCode, messageID);
              }
            }
          });
          resolve(result);
        }
      }).catch(error => {
        (0, _logger.zlogerror)('SendInRoomMessage falied: ', error);
        reject(error);
      });
    });
  },

  onInRoomMessageReceived(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onInRoomMessageReceivedCallbackMap) {
        (0, _logger.zloginfo)('[onInRoomMessageReceived] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onInRoomMessageReceivedCallbackMap[callbackID];
      }
    } else {
      _onInRoomMessageReceivedCallbackMap[callbackID] = callback;
    }
  },

  onInRoomMessageSent(callbackID, callback) {
    if (typeof callback !== 'function') {
      if (callbackID in _onInRoomMessageSentCallbackMap) {
        (0, _logger.zloginfo)('[onInRoomMessageSent] Remove callback for: [', callbackID, '] because callback is not a valid function!');
        delete _onInRoomMessageSentCallbackMap[callbackID];
      }
    } else {
      _onInRoomMessageSentCallbackMap[callbackID] = callback;
    }
  }

};
exports.default = _default;
//# sourceMappingURL=ZegoUIKitInternal.js.map