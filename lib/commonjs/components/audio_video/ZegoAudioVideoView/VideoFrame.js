"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = VideoFrame;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _zegoExpressEngineReactnative = require("zego-express-engine-reactnative");

var _ZegoUIKitInternal = _interopRequireDefault(require("../../internal/ZegoUIKitInternal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function VideoFrame(props) {
  const {
    userID,
    roomID,
    fillMode
  } = props;
  const viewRef = (0, _react.useRef)(null);

  const updateRenderingProperty = () => {
    const viewID = (0, _reactNative.findNodeHandle)(viewRef.current);

    _ZegoUIKitInternal.default.updateRenderingProperty(userID, viewID, fillMode);
  };

  (0, _react.useEffect)(() => {
    updateRenderingProperty();

    _ZegoUIKitInternal.default.onSDKConnected('VideoFrame' + userID, () => {
      updateRenderingProperty();
    });

    _ZegoUIKitInternal.default.onUserJoin('VideoFrame' + userID, userInfoList => {
      userInfoList.forEach(user => {
        if (user.userID == userID) {
          updateRenderingProperty();
        }
      });
    });

    return () => {
      _ZegoUIKitInternal.default.onSDKConnected('VideoFrame' + userID);

      _ZegoUIKitInternal.default.onUserJoin('VideoFrame' + userID);

      _ZegoUIKitInternal.default.updateRenderingProperty(userID, -1, fillMode);
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_zegoExpressEngineReactnative.ZegoTextureView, {
    style: styles.videoContainer,
    ref: viewRef,
    collapsable: false
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.audioContainer
  }, props.children));
}

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  videoContainer: {
    // flex: 1,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 1
  },
  audioContainer: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 2
  }
});
//# sourceMappingURL=VideoFrame.js.map