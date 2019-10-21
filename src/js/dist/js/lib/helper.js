"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNotExist = exports.isExists = exports.isNotNull = void 0;

var isNotNull = function isNotNull(x) {
  return x !== null && x !== undefined;
};

exports.isNotNull = isNotNull;

var isExists = function isExists() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.every(function (val) {
    return val !== null && val !== undefined;
  });
};

exports.isExists = isExists;

var isNotExist = function isNotExist(x) {
  return x === null || x === undefined;
};

exports.isNotExist = isNotExist;