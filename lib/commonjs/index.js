"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ZegoAudioVideoContainer", {
  enumerable: true,
  get: function () {
    return _ZegoAudioVideoContainer.default;
  }
});
Object.defineProperty(exports, "ZegoAudioVideoView", {
  enumerable: true,
  get: function () {
    return _ZegoAudioVideoView.default;
  }
});
Object.defineProperty(exports, "ZegoCameraStateIcon", {
  enumerable: true,
  get: function () {
    return _ZegoCameraStateIcon.default;
  }
});
Object.defineProperty(exports, "ZegoInRoomMessageInput", {
  enumerable: true,
  get: function () {
    return _ZegoInRoomMessageInput.default;
  }
});
Object.defineProperty(exports, "ZegoInRoomMessageView", {
  enumerable: true,
  get: function () {
    return _ZegoInRoomMessageView.default;
  }
});
Object.defineProperty(exports, "ZegoLayoutMode", {
  enumerable: true,
  get: function () {
    return _ZegoAudioVideoContainer.ZegoLayoutMode;
  }
});
Object.defineProperty(exports, "ZegoLeaveButton", {
  enumerable: true,
  get: function () {
    return _ZegoLeaveButton.default;
  }
});
Object.defineProperty(exports, "ZegoMemberList", {
  enumerable: true,
  get: function () {
    return _ZegoMemberList.default;
  }
});
Object.defineProperty(exports, "ZegoMicrophoneStateIcon", {
  enumerable: true,
  get: function () {
    return _ZegoMicrophoneStateIcon.default;
  }
});
Object.defineProperty(exports, "ZegoSwitchAudioOutputButton", {
  enumerable: true,
  get: function () {
    return _ZegoSwitchAudioOutputButton.default;
  }
});
Object.defineProperty(exports, "ZegoSwitchCameraButton", {
  enumerable: true,
  get: function () {
    return _ZegoSwitchCameraButton.default;
  }
});
Object.defineProperty(exports, "ZegoToggleCameraButton", {
  enumerable: true,
  get: function () {
    return _ZegoToggleCameraButton.default;
  }
});
Object.defineProperty(exports, "ZegoToggleMicrophoneButton", {
  enumerable: true,
  get: function () {
    return _ZegoToggleMicrophoneButton.default;
  }
});
exports.default = void 0;

var _ZegoUIKitInternal = _interopRequireDefault(require("./components/internal/ZegoUIKitInternal"));

var _ZegoAudioVideoView = _interopRequireDefault(require("./components/audio_video/ZegoAudioVideoView"));

var _ZegoCameraStateIcon = _interopRequireDefault(require("./components/audio_video/ZegoCameraStateIcon"));

var _ZegoMicrophoneStateIcon = _interopRequireDefault(require("./components/audio_video/ZegoMicrophoneStateIcon"));

var _ZegoSwitchCameraButton = _interopRequireDefault(require("./components/audio_video/ZegoSwitchCameraButton"));

var _ZegoToggleMicrophoneButton = _interopRequireDefault(require("./components/audio_video/ZegoToggleMicrophoneButton"));

var _ZegoToggleCameraButton = _interopRequireDefault(require("./components/audio_video/ZegoToggleCameraButton"));

var _ZegoSwitchAudioOutputButton = _interopRequireDefault(require("./components/audio_video/ZegoSwitchAudioOutputButton"));

var _ZegoAudioVideoContainer = _interopRequireWildcard(require("./components/audio_video_container/ZegoAudioVideoContainer"));

var _ZegoLeaveButton = _interopRequireDefault(require("./components/audio_video/ZegoLeaveButton"));

var _ZegoInRoomMessageInput = _interopRequireDefault(require("./components/in_room_message/ZegoInRoomMessageInput"));

var _ZegoInRoomMessageView = _interopRequireDefault(require("./components/in_room_message/ZegoInRoomMessageView"));

var _ZegoMemberList = _interopRequireDefault(require("./components/in_room_member/ZegoMemberList"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  init: _ZegoUIKitInternal.default.connectSDK,
  uninit: _ZegoUIKitInternal.default.disconnectSDK,
  useFrontFacingCamera: _ZegoUIKitInternal.default.useFrontFacingCamera,
  isMicrophoneOn: _ZegoUIKitInternal.default.isMicDeviceOn,
  isCameraOn: _ZegoUIKitInternal.default.isCameraDeviceOn,
  setAudioOutputToSpeaker: _ZegoUIKitInternal.default.setAudioOutputToSpeaker,
  turnMicrophoneOn: _ZegoUIKitInternal.default.turnMicDeviceOn,
  turnCameraOn: _ZegoUIKitInternal.default.turnCameraDeviceOn,
  onMicrophoneOn: _ZegoUIKitInternal.default.onMicDeviceOn,
  onCameraOn: _ZegoUIKitInternal.default.onCameraDeviceOn,
  onAudioOutputDeviceChanged: _ZegoUIKitInternal.default.onAudioOutputDeviceTypeChange,
  onSoundLevelUpdated: _ZegoUIKitInternal.default.onSoundLevelUpdate,
  // onAudioVideoAvailable
  // onAudioVideoUnavailable
  joinRoom: _ZegoUIKitInternal.default.joinRoom,
  leaveRoom: _ZegoUIKitInternal.default.leaveRoom,
  onOnlySelfInRoom: _ZegoUIKitInternal.default.onOnlySelfInRoom,
  onRoomStateChanged: _ZegoUIKitInternal.default.onRoomStateChanged,
  onRequireNewToken: _ZegoUIKitInternal.default.onRequireNewToken,
  connectUser: _ZegoUIKitInternal.default.connectUser,
  disconnectUser: _ZegoUIKitInternal.default.disconnectUser,
  getUser: _ZegoUIKitInternal.default.getUser,
  getAllUsers: _ZegoUIKitInternal.default.getAllUsers,
  onUserJoin: _ZegoUIKitInternal.default.onUserJoin,
  onUserLeave: _ZegoUIKitInternal.default.onUserLeave,
  onAudioVideoAvailable: _ZegoUIKitInternal.default.onAudioVideoAvailable,
  onAudioVideoUnavailable: _ZegoUIKitInternal.default.onAudioVideoUnavailable,
  getInRoomMessages: _ZegoUIKitInternal.default.getInRoomMessages,
  sendInRoomMessage: _ZegoUIKitInternal.default.sendInRoomMessage,
  onInRoomMessageReceived: _ZegoUIKitInternal.default.onInRoomMessageReceived,
  onInRoomMessageSent: _ZegoUIKitInternal.default.onInRoomMessageSent
};
exports.default = _default;
//# sourceMappingURL=index.js.map