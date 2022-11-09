"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PictureInPictureLayout;

var _react = _interopRequireWildcard(require("react"));

var _ZegoUIKitInternal = _interopRequireDefault(require("../../internal/ZegoUIKitInternal"));

var _ZegoAudioVideoView = _interopRequireDefault(require("../../audio_video/ZegoAudioVideoView"));

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// enum ZegoViewPostion {
//     topLeft = 0,
//     topRight = 1,
//     bottomLeft = 2,
//     bottomRight = 3
//     }
function PictureInPictureLayout(props) {
  const {
    config = {},
    foregroundBuilder,
    audioVideoConfig = {}
  } = props;
  const {
    isSmallViewDraggable = false,
    // TODO
    showMyViewWithVideoOnly = false,
    smallViewBackgroundColor = '',
    largeViewBackgroundColor = '',
    smallViewBackgroundImage = '',
    largeViewBackgroundImage = '',
    smallViewPostion = 1,
    switchLargeOrSmallViewByClick = true
  } = config;
  const {
    useVideoViewAspectFill = false,
    showSoundWavesInAudioMode = true
  } = audioVideoConfig;
  const [localUserID, setLocalUserID] = (0, _react.useState)('');
  const [remoteUserID, setRemoteUserID] = (0, _react.useState)('');
  const [showMeOnSmallView, setShowMeOnSmallView] = (0, _react.useState)(true);
  (0, _react.useEffect)(() => {
    const callbackID = 'PictureInPictureLayout' + String(Math.floor(Math.random() * 10000));

    _ZegoUIKitInternal.default.onSDKConnected(callbackID, () => {
      setLocalUserID(_ZegoUIKitInternal.default.getLocalUserInfo().userID);
    });

    _ZegoUIKitInternal.default.onRoomStateChanged(callbackID, (reason, errorCode, extendedData) => {
      if (reason == 1 || reason == 4) {
        setLocalUserID(_ZegoUIKitInternal.default.getLocalUserInfo().userID);
      } else if (reason == 2 || reason == 5 || reason == 6 || reason == 7) {
        // ZegoRoomStateChangedReasonLoginFailed
        // ZegoRoomStateChangedReasonReconnectFailed
        // ZegoRoomStateChangedReasonKickOut
        // ZegoRoomStateChangedReasonLogout
        // ZegoRoomStateChangedReasonLogoutFailed
        setLocalUserID('');
        setRemoteUserID('');
      }
    });

    _ZegoUIKitInternal.default.onUserJoin(callbackID, userList => {
      console.log('>>>>>>>>>>> join', userList);

      if (userList.length == 1) {
        setRemoteUserID(userList[0].userID);
      } else {//TODO
      }
    });

    _ZegoUIKitInternal.default.onUserLeave(callbackID, userList => {
      console.log('<<<<<<<<<<<<<< leave', userList);

      if (userList.length == 1) {
        setRemoteUserID('');
      } else {//TODO
      }
    });

    return () => {
      _ZegoUIKitInternal.default.onSDKConnected(callbackID);

      _ZegoUIKitInternal.default.onRoomStateChanged(callbackID);

      _ZegoUIKitInternal.default.onUserJoin(callbackID);

      _ZegoUIKitInternal.default.onUserLeave(callbackID);
    };
  }, []);
  /*
  enum {
      topLeft = 0,
      topRight = 1,
      bottomLeft = 2,
      bottomRight = 3
  }
  */

  const getSmallViewPostStyle = () => {
    const styleList = [styles.smallViewPostTopLeft, styles.smallViewPostTopRight, styles.smallViewPostBottomLeft, styles.smallViewPostBottomRgith];

    if (smallViewPostion >= 0 && smallViewPostion <= 3) {
      return styleList[smallViewPostion];
    } else {
      return styles.smallViewPostTopLeft;
    }
  };

  const getSmallViewBorderStyle = () => {
    if (showMeOnSmallView) {
      return localUserID ? styles.smallViewBorder : '';
    } else {
      return remoteUserID ? styles.smallViewBorder : '';
    }
  };

  const switchLargeOrSmallView = () => {
    if (switchLargeOrSmallViewByClick) {
      setShowMeOnSmallView(!showMeOnSmallView);
    }
  };

  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    pointerEvents: "auto",
    onTouchStart: switchLargeOrSmallView,
    style: [styles.smallView, getSmallViewPostStyle(), getSmallViewBorderStyle()]
  }, showMeOnSmallView ? localUserID ? /*#__PURE__*/_react.default.createElement(_ZegoAudioVideoView.default, {
    key: localUserID,
    userID: localUserID,
    audioViewBackgroudColor: smallViewBackgroundColor,
    audioViewBackgroudImage: smallViewBackgroundImage,
    showSoundWave: showSoundWavesInAudioMode,
    useVideoViewAspectFill: useVideoViewAspectFill,
    foregroundBuilder: foregroundBuilder
  }) : /*#__PURE__*/_react.default.createElement(_reactNative.View, null) : remoteUserID ? /*#__PURE__*/_react.default.createElement(_ZegoAudioVideoView.default, {
    key: remoteUserID,
    userID: remoteUserID,
    audioViewBackgroudColor: smallViewBackgroundColor,
    audioViewBackgroudImage: smallViewBackgroundImage,
    showSoundWave: showSoundWavesInAudioMode,
    useVideoViewAspectFill: useVideoViewAspectFill,
    foregroundBuilder: foregroundBuilder
  }) : /*#__PURE__*/_react.default.createElement(_reactNative.View, null)), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.bigView
  }, showMeOnSmallView ? remoteUserID ? /*#__PURE__*/_react.default.createElement(_ZegoAudioVideoView.default, {
    key: remoteUserID,
    userID: remoteUserID,
    audioViewBackgroudColor: largeViewBackgroundColor,
    audioViewBackgroudImage: largeViewBackgroundImage,
    showSoundWave: showSoundWavesInAudioMode,
    useVideoViewAspectFill: useVideoViewAspectFill,
    foregroundBuilder: foregroundBuilder
  }) : /*#__PURE__*/_react.default.createElement(_reactNative.View, null) : localUserID ? /*#__PURE__*/_react.default.createElement(_ZegoAudioVideoView.default, {
    key: localUserID,
    userID: localUserID,
    audioViewBackgroudColor: largeViewBackgroundColor,
    audioViewBackgroudImage: largeViewBackgroundImage,
    showSoundWave: showSoundWavesInAudioMode,
    useVideoViewAspectFill: useVideoViewAspectFill,
    foregroundBuilder: foregroundBuilder
  }) : /*#__PURE__*/_react.default.createElement(_reactNative.View, null)));
}

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  emptyView: {
    backgroundColor: '#4A4B4D'
  },
  bigView: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#4A4B4D',
    zIndex: 1
  },
  smallView: {
    flex: 1,
    height: 169,
    width: 95,
    position: 'absolute',
    top: 70,
    right: 12,
    zIndex: 2,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#4A4B4D'
  },
  smallViewBorder: {
    borderWidth: 0.5,
    borderColor: '#A4A4A4'
  },
  smallViewPostTopLeft: {
    top: 70,
    left: 12
  },
  smallViewPostTopRight: {
    top: 70,
    right: 12
  },
  smallViewPostBottomLeft: {
    bottom: 70,
    left: 12
  },
  smallViewPostBottomRgith: {
    bottom: 70,
    right: 12
  }
});
//# sourceMappingURL=PictureInPictureLayout.js.map