"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ZegoToggleCameraButton;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ZegoUIKitInternal = _interopRequireDefault(require("../internal/ZegoUIKitInternal"));

var _logger = require("../../utils/logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ZegoToggleCameraButton(props) {
  const {
    userID,
    iconCameraOn,
    iconCameraOff,
    isOn,
    onPress,
    width = 48,
    height = 48
  } = props;
  const [isCurrentOn, setIsCurrentOn] = (0, _react.useState)(true); // Default on

  const getImageSourceByPath = () => {
    const pathOn = iconCameraOn ? iconCameraOn : require("../internal/resources/white_button_camera_on.png");
    const pathOff = iconCameraOff ? iconCameraOff : require("../internal/resources/white_button_camera_off.png");
    return isCurrentOn ? pathOn : pathOff;
  };

  const onButtonPress = () => {
    _ZegoUIKitInternal.default.turnCameraDeviceOn(userID, !isCurrentOn);

    if (typeof onPress == 'function') {
      onPress();
    }
  };

  (0, _react.useEffect)(() => {
    setIsCurrentOn(_ZegoUIKitInternal.default.isCameraDeviceOn(userID));
  });
  (0, _react.useEffect)(() => {
    const callbackID = 'ZegoToggleCameraButton' + String(Math.floor(Math.random() * 10000));

    _ZegoUIKitInternal.default.onCameraDeviceOn(callbackID, (id, on) => {
      if (userID === undefined || userID === '') {
        // local user
        if (id == _ZegoUIKitInternal.default.getLocalUserInfo().userID) {
          setIsCurrentOn(on);
        }
      } else if (id == userID) {
        setIsCurrentOn(on);
      }
    });

    _ZegoUIKitInternal.default.onSDKConnected(callbackID, () => {
      _ZegoUIKitInternal.default.turnCameraDeviceOn(userID, isOn);

      setIsCurrentOn(_ZegoUIKitInternal.default.isCameraDeviceOn(userID));
    });

    return () => {
      _ZegoUIKitInternal.default.onCameraDeviceOn(callbackID);

      _ZegoUIKitInternal.default.onSDKConnected(callbackID);
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: {
      width: width,
      height: height
    },
    onPress: onButtonPress
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    resizeMode: "contain",
    source: getImageSourceByPath(),
    style: {
      width: "100%",
      height: "100%"
    }
  }));
}
//# sourceMappingURL=ZegoToggleCameraButton.js.map