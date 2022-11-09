"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AudioFrame;

var _reactNative = require("react-native");

var _react = _interopRequireWildcard(require("react"));

var _ZegoUIKitInternal = _interopRequireDefault(require("../../internal/ZegoUIKitInternal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function AudioFrame(props) {
  const {
    userInfo,
    showSoundWave,
    audioViewBackgroudColor,
    audioViewBackgroudImage
  } = props;
  const [hasSound, setHasSound] = (0, _react.useState)(false);

  const getShotName = name => {
    if (!name) {
      return '';
    }

    const nl = name.split(' ');
    var shotName = '';
    nl.forEach(part => {
      if (part !== '') {
        shotName += part.substring(0, 1);
      }
    });
    return shotName;
  };

  (0, _react.useEffect)(() => {
    _ZegoUIKitInternal.default.onSoundLevelUpdate('AudioFrame' + userInfo.userID, (userID, soundLevel) => {
      if (userInfo.userID == userID) {
        setHasSound(soundLevel > 5);
      }
    });

    return () => {
      _ZegoUIKitInternal.default.onSoundLevelUpdate('AudioFrame' + userInfo.userID);
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: cstyle(audioViewBackgroudColor ? audioViewBackgroudColor : '#4A4B4D').container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.ImageBackground, {
    source: audioViewBackgroudImage ? {
      uri: audioViewBackgroudImage
    } : null,
    resizeMode: "cover",
    style: styles.imgBackground
  }, showSoundWave && hasSound ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: waveStyle(164, '#515155').circleWave
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: waveStyle(153, '#636266').subCircleWave
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: waveStyle(141, '#6B6A71').subCircleWave
  })) : /*#__PURE__*/_react.default.createElement(_reactNative.View, null), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.avatar
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.nameLabel
  }, getShotName(userInfo.userName)))));
}

const cstyle = bgColor => _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: bgColor
  }
});

const waveStyle = (w, color) => _reactNative.StyleSheet.create({
  circleWave: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    width: (w / 375 * 100).toString() + '%',
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: color,
    zIndex: 0,
    justifyContent: 'center',
    alignContent: 'center'
  },
  subCircleWave: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    width: (w / 164 * 100).toString() + '%',
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: color,
    zIndex: 0
  }
});

const styles = _reactNative.StyleSheet.create({
  imgBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center'
  },
  avatar: {
    flex: 1,
    width: (129 / 375 * 100).toString() + '%',
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: '#DBDDE3',
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  nameLabel: {
    flex: 1,
    position: 'absolute',
    color: '#222222',
    fontSize: 22
  }
});
//# sourceMappingURL=AudioFrame.js.map