import React, { useState, useEffect } from "react";
import { Image, View } from "react-native";
import ZegoUIKitInternal from "../internal/ZegoUIKitInternal";
export default function ZegoMicrophoneStateIcon(props) {
  const {
    userID,
    iconMicrophoneOn,
    iconMicrophoneOff,
    iconMicrophoneSpeaking
  } = props;
  const [isOn, setIsOn] = useState(true);
  const [hasSound, setHasSound] = useState(false);

  const getImageSourceByPath = () => {
    const pathOn = iconMicrophoneOn ? iconMicrophoneOn : require("../internal/resources/white_icon_video_mic_on.png");
    const pathOff = iconMicrophoneOff ? iconMicrophoneOff : require("../internal/resources/white_icon_video_mic_off.png");
    const pathSpeaking = iconMicrophoneSpeaking ? iconMicrophoneSpeaking : require("../internal/resources/white_icon_video_mic_speaking.png");
    return isOn ? hasSound ? pathSpeaking : pathOn : pathOff;
  };

  useEffect(() => {
    setIsOn(ZegoUIKitInternal.isMicDeviceOn(userID));
  });
  useEffect(() => {
    const callbackID = 'ZegoMicrophoneStateIcon' + String(Math.floor(Math.random() * 10000));
    ZegoUIKitInternal.onSDKConnected(callbackID, () => {
      setIsOn(ZegoUIKitInternal.isMicDeviceOn(userID));
    });
    ZegoUIKitInternal.onMicDeviceOn(callbackID, (id, on) => {
      if (userID === undefined || userID === '') {
        // local user
        if (id == ZegoUIKitInternal.getLocalUserInfo().userID) {
          setIsOn(on);
        }
      } else if (id == userID) {
        setIsOn(on);
      }
    });
    ZegoUIKitInternal.onSoundLevelUpdate(callbackID, (uid, soundLevel) => {
      if (uid == userID) {
        setHasSound(soundLevel > 5);
      }
    });
    return () => {
      ZegoUIKitInternal.onSDKConnected(callbackID);
      ZegoUIKitInternal.onMicDeviceOn(callbackID);
      ZegoUIKitInternal.onSoundLevelUpdate(callbackID);
    };
  }, []);
  return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Image, {
    source: getImageSourceByPath()
  }));
}
//# sourceMappingURL=ZegoMicrophoneStateIcon.js.map