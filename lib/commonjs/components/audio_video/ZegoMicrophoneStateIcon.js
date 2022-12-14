"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ZegoMicrophoneStateIcon;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ZegoUIKitInternal = _interopRequireDefault(require("../internal/ZegoUIKitInternal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ZegoMicrophoneStateIcon(props) {
  const {
    userID,
    iconMicrophoneOn,
    iconMicrophoneOff,
    iconMicrophoneSpeaking
  } = props;
  const [isOn, setIsOn] = (0, _react.useState)(true);
  const [hasSound, setHasSound] = (0, _react.useState)(false);

  const getImageSourceByPath = () => {
    const pathOn = iconMicrophoneOn ? iconMicrophoneOn : require("../internal/resources/white_icon_video_mic_on.png");
    const pathOff = iconMicrophoneOff ? iconMicrophoneOff : require("../internal/resources/white_icon_video_mic_off.png");
    const pathSpeaking = iconMicrophoneSpeaking ? iconMicrophoneSpeaking : require("../internal/resources/white_icon_video_mic_speaking.png");
    return isOn ? hasSound ? pathSpeaking : pathOn : pathOff;
  };

  (0, _react.useEffect)(() => {
    setIsOn(_ZegoUIKitInternal.default.isMicDeviceOn(userID));
  });
  (0, _react.useEffect)(() => {
    const callbackID = 'ZegoMicrophoneStateIcon' + String(Math.floor(Math.random() * 10000));

    _ZegoUIKitInternal.default.onSDKConnected(callbackID, () => {
      setIsOn(_ZegoUIKitInternal.default.isMicDeviceOn(userID));
    });

    _ZegoUIKitInternal.default.onMicDeviceOn(callbackID, (id, on) => {
      if (userID === undefined || userID === '') {
        // local user
        if (id == _ZegoUIKitInternal.default.getLocalUserInfo().userID) {
          setIsOn(on);
        }
      } else if (id == userID) {
        setIsOn(on);
      }
    });

    _ZegoUIKitInternal.default.onSoundLevelUpdate(callbackID, (uid, soundLevel) => {
      if (uid == userID) {
        setHasSound(soundLevel > 5);
      }
    });

    return () => {
      _ZegoUIKitInternal.default.onSDKConnected(callbackID);

      _ZegoUIKitInternal.default.onMicDeviceOn(callbackID);

      _ZegoUIKitInternal.default.onSoundLevelUpdate(callbackID);
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: getImageSourceByPath()
  }));
}
//# sourceMappingURL=ZegoMicrophoneStateIcon.js.map