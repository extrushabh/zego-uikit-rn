"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ZegoLeaveButton;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _ZegoUIKitInternal = _interopRequireDefault(require("../internal/ZegoUIKitInternal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ZegoLeaveButton(props) {
  const {
    iconLeave,
    onLeaveConfirmation,
    onPressed,
    width = 48,
    height = 48
  } = props;

  const onPress = () => {
    if (typeof onLeaveConfirmation == 'function') {
      onLeaveConfirmation().then(() => {
        _ZegoUIKitInternal.default.leaveRoom();

        if (typeof onPressed == 'function') {
          onPressed();
        }
      });
    } else {
      _ZegoUIKitInternal.default.leaveRoom();

      if (typeof onPressed == 'function') {
        onPressed();
      }
    }
  };

  return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: {
      width: width,
      height: height
    },
    onPress: onPress
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    resizeMode: "contain",
    source: iconLeave ? iconLeave : require("../internal/resources/white_button_hang_up.png"),
    style: {
      width: "100%",
      height: "100%"
    }
  }));
}
//# sourceMappingURL=ZegoLeaveButton.js.map