"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ZegoSwitchCameraButton;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ZegoUIKitInternal = _interopRequireDefault(require("../internal/ZegoUIKitInternal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ZegoSwitchCameraButton(props) {
  // TODO useFrontFacingCamera may cause problems when create a lot of times during connected
  const {
    iconFrontFacingCamera,
    iconBackFacingCamera,
    useFrontFacingCamera = true,
    onPress,
    width = 48,
    height = 48
  } = props;
  const [isFront, setIsFront] = (0, _react.useState)(_ZegoUIKitInternal.default.isUsingFrontFacingCamera());

  const getImageSourceByPath = () => {
    const pathFront = iconFrontFacingCamera ? iconFrontFacingCamera : require("../internal/resources/white_button_flip_camera.png");
    const pathBack = iconBackFacingCamera ? iconFrontFacingCamera : require("../internal/resources/white_button_flip_camera.png");
    return isFront ? pathFront : pathBack;
  };

  const onButtonPress = () => {
    _ZegoUIKitInternal.default.useFrontFacingCamera(!isFront);

    setIsFront(!isFront);

    if (typeof onPress == 'function') {
      onPress();
    }
  };

  (0, _react.useEffect)(() => {
    const callbackID = 'ZegoSwitchCameraButton' + String(Math.floor(Math.random() * 10000));

    _ZegoUIKitInternal.default.onSDKConnected(callbackID, () => {
      _ZegoUIKitInternal.default.useFrontFacingCamera(useFrontFacingCamera);

      setIsFront(useFrontFacingCamera);
    });

    return () => {
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
//# sourceMappingURL=ZegoSwitchCameraButton.js.map