'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _treeNode = _interopRequireDefault(require("./treeNode"));

var _color = _interopRequireDefault(require("./color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function createLeafNode(parent) {
  var node = new _treeNode["default"](null, null);
  node.color = _color["default"].BLACK;
  node.parent = parent;
  return node;
}

var _default = createLeafNode;
exports["default"] = _default;