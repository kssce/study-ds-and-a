"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toNumber = toNumber;
exports.isNilNode = isNilNode;

var _color = _interopRequireDefault(require("./color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function toNumber(key) {
  var offset = 96; //if key is not a number

  if (isNaN(key) && typeof key === "string") {
    var keyToLower = key.toLowerCase();

    if (keyToLower.length > 1) {
      var number = ''; //converting each letter to a number

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keyToLower[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var ch = _step.value;
          number += ch.charCodeAt(0) - offset + '';
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return parseInt(number);
    }

    return keyToLower.charCodeAt(0) - offset;
  }

  return key;
}

function isNilNode(node) {
  return node == null || node.key == null && node.value == null && node.color === _color["default"].BLACK && node.left == null && node.right == null;
}