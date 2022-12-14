"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MoreFrame;

var _reactNative = require("react-native");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MoreFrame(props) {
  const {
    roomID,
    userList,
    audioViewBackgroudColor,
    audioViewBackgroudImage,
    useVideoViewAspectFill = false
  } = props;

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

  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: cstyle(audioViewBackgroudColor ? audioViewBackgroudColor : '#4A4B4D').container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.ImageBackground, {
    source: audioViewBackgroudImage ? {
      uri: audioViewBackgroudImage
    } : null,
    resizeMode: "cover",
    style: styles.imgBackground
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.avatarContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.avatar, styles.avatar1]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.nameLabel
  }, getShotName(userList[0].userName))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.avatar, styles.avatar2]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.nameLabel
  }, getShotName(userList[1].userName)))), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.totalText
  }, `${userList.length} others`)));
}

const cstyle = bgColor => _reactNative.StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bgColor,
    position: 'absolute'
  }
});

const styles = _reactNative.StyleSheet.create({
  imgBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 2
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  avatar: {
    width: (129 / 375 * 100).toString() + '%',
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: '#DBDDE3',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    position: 'relative'
  },
  avatar1: {
    left: (10 / 60 * 100).toString() + '%'
  },
  avatar2: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#4A4B4D',
    right: (10 / 60 * 100).toString() + '%'
  },
  nameLabel: {
    color: '#222222',
    fontSize: 23
  },
  totalText: {
    marginTop: 29.5,
    fontSize: 12,
    color: '#FFFFFF'
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1
  }
});
//# sourceMappingURL=MoreFrame.js.map