"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zlogwarning = exports.zloginfo = exports.zlogerror = void 0;

const zloginfo = function () {
  for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
    msg[_key] = arguments[_key];
  }

  console.log("ZEGOUIKit[INFO]: ", ...msg);
};

exports.zloginfo = zloginfo;

const zlogwarning = msg => {
  console.warn("ZEGOUIKit[WARNING]: ", ...msg);
};

exports.zlogwarning = zlogwarning;

const zlogerror = msg => {
  console.error("ZEGOUIKit[ERROR]: ", ...msg);
};

exports.zlogerror = zlogerror;
//# sourceMappingURL=logger.js.map