"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ZegoSwitchAudioOutputButton;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ZegoUIKitInternal = _interopRequireDefault(require("../internal/ZegoUIKitInternal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ZegoSwitchAudioOutputButton(props) {
  // ZegoAudioRouteSpeaker=(0) ZegoAudioRouteHeadphone=(1) ZegoAudioRouteBluetooth=(2) ZegoAudioRouteReceiver=(3) ZegoAudioRouteExternalUSB=(4) ZegoAudioRouteAirPlay=(5)
  const {
    iconSpeaker,
    iconEarpiece,
    iconBluetooth,
    useSpeaker = false,
    width = 48,
    height = 48
  } = props;
  const [currentDevice, setCurrentDevice] = (0, _react.useState)(0); // Default to speaker

  const [enable, setEnable] = (0, _react.useState)(true);

  const getImageSourceByPath = () => {
    var path = "";

    if (currentDevice == 0) {
      path = iconSpeaker ? iconSpeaker : require("../internal/resources/white_button_speaker_on.png");
    } else if (currentDevice == 2) {
      path = iconBluetooth ? iconBluetooth : require("../internal/resources/white_button_bluetooth_off.png");
    } else {
      path = iconEarpiece ? iconEarpiece : require("../internal/resources/white_button_speaker_off.png");
    }

    return path;
  };

  const onPress = () => {
    if (enable) {
      var usingSpeaker = currentDevice == 0;

      _ZegoUIKitInternal.default.setAudioOutputToSpeaker(!usingSpeaker);
    }
  };

  const updateDeviceType = type => {
    setCurrentDevice(type);
    setEnable(type == 0 || type == 3);
  };

  (0, _react.useEffect)(() => {
    setCurrentDevice(_ZegoUIKitInternal.default.audioOutputDeviceType());
  });
  (0, _react.useEffect)(() => {
    const callbackID = 'ZegoSwitchAudioOutputButton' + String(Math.floor(Math.random() * 10000));

    _ZegoUIKitInternal.default.onAudioOutputDeviceTypeChange(callbackID, type => {
      updateDeviceType(type);
    });

    _ZegoUIKitInternal.default.onSDKConnected(callbackID, () => {
      _ZegoUIKitInternal.default.setAudioOutputToSpeaker(useSpeaker);

      updateDeviceType(_ZegoUIKitInternal.default.audioOutputDeviceType());
    });

    return () => {
      _ZegoUIKitInternal.default.onAudioOutputDeviceTypeChange(callbackID);

      _ZegoUIKitInternal.default.onSDKConnected(callbackID);
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: {
      width: width,
      height: height
    },
    disabled: !enable // Only speaker can toggle enable
    ,
    onPress: onPress
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    resizeMode: "contain",
    source: getImageSourceByPath(),
    style: {
      width: "100%",
      height: "100%"
    }
  }));
}
//# sourceMappingURL=ZegoSwitchAudioOutputButton.js.map