"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ZegoCameraStateIcon;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ZegoUIKitInternal = _interopRequireDefault(require("../internal/ZegoUIKitInternal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ZegoCameraStateIcon(props) {
  const {
    userID,
    iconCameraOn,
    iconCameraOff
  } = props;
  const [isOn, setIsOn] = (0, _react.useState)(true); // Default on

  const getImageSourceByPath = () => {
    const pathOn = iconCameraOn ? iconCameraOn : require("../internal/resources/white_icon_video_camera_on.png");
    const pathOff = iconCameraOff ? iconCameraOff : require("../internal/resources/white_icon_video_camera_off.png");
    return isOn ? pathOn : pathOff;
  };

  (0, _react.useEffect)(() => {
    setIsOn(_ZegoUIKitInternal.default.isCameraDeviceOn(userID));
  });
  (0, _react.useEffect)(() => {
    const callbackID = 'ZegoCameraStateIcon' + String(Math.floor(Math.random() * 10000));

    _ZegoUIKitInternal.default.onSDKConnected(callbackID, () => {
      setIsOn(_ZegoUIKitInternal.default.isCameraDeviceOn(userID));
    });

    _ZegoUIKitInternal.default.onCameraDeviceOn(callbackID, (id, on) => {
      if (userID === undefined || userID === '') {
        // local user
        if (id == _ZegoUIKitInternal.default.getLocalUserInfo().userID) {
          setIsOn(on);
        }
      } else if (id == userID) {
        setIsOn(on);
      }
    });

    return () => {
      _ZegoUIKitInternal.default.onSDKConnected(callbackID);

      _ZegoUIKitInternal.default.onCameraDeviceOn(callbackID);
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: getImageSourceByPath()
  }));
}
//# sourceMappingURL=ZegoCameraStateIcon.js.map