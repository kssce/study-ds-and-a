'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _color = _interopRequireDefault(require("./color"));

var _helper = require("./helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Node of the red black tree
 * constructor
 * param key : Number
 * param value : Object
 * param left : Node
 * param right : Node
 * param color : Number
 */
var Node =
/*#__PURE__*/
function () {
  function Node(key, value) {
    _classCallCheck(this, Node);

    this.key = (0, _helper.toNumber)(key);
    this.value = value;
    this.left = null;
    this.right = null;
    this.color = null;
    this.parent = null;
  }
  /**
   * return Boolean
   */


  _createClass(Node, [{
    key: "isRed",
    value: function isRed() {
      return this.color === _color["default"].RED;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return {
        key: this.key,
        value: this.value
      };
    }
  }]);

  return Node;
}();

var _default = Node;
exports["default"] = _default;