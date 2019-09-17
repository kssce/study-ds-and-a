'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _treeNode = _interopRequireDefault(require("./treeNode"));

var _color = _interopRequireDefault(require("./color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function createNode(key, value) {
  var node = new _treeNode["default"](key, value); //left leaf has color black. left, right to be nul

  var leftLeaf = new _treeNode["default"](null, null);
  leftLeaf.color = _color["default"].BLACK;
  leftLeaf.left = null;
  leftLeaf.right = null;
  leftLeaf.parent = node; //right leaf has color black. left, right to be nul

  var rightLeaf = new _treeNode["default"](null, null);
  rightLeaf.color = _color["default"].BLACK;
  rightLeaf.left = null;
  rightLeaf.right = null;
  rightLeaf.parent = node; //map leaves

  node.left = leftLeaf;
  node.right = rightLeaf;
  return node;
}

var _default = createNode;
exports["default"] = _default;