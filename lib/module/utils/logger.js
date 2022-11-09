export const zloginfo = function () {
  for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
    msg[_key] = arguments[_key];
  }

  console.log("ZEGOUIKit[INFO]: ", ...msg);
};
export const zlogwarning = msg => {
  console.warn("ZEGOUIKit[WARNING]: ", ...msg);
};
export const zlogerror = msg => {
  console.error("ZEGOUIKit[ERROR]: ", ...msg);
};
//# sourceMappingURL=logger.js.map