"use strict";

var _treeNode = _interopRequireDefault(require("../treeNode"));

var _color = _interopRequireDefault(require("../color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var node;
beforeEach(function () {
  node = new _treeNode["default"](1, "abc");
  return node;
});
test('Node isRed false', function () {
  node.color = _color["default"].BLACK;
  expect(node.isRed()).toBe(false);
});
test('Node isRed true', function () {
  node.color = _color["default"].RED;
  expect(node.isRed()).toBe(true);
});
test('Node getValue()', function () {
  var expected = {
    key: 1,
    value: "abc"
  };
  expect(node.getValue()).toMatchObject(expected);
});