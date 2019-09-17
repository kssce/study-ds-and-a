"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helper = require("./helper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var iterator =
/*#__PURE__*/
function () {
  function iterator(root) {
    _classCallCheck(this, iterator);

    this.stack = [];
    this.curr = root;
  }

  _createClass(iterator, [{
    key: "hasNext",
    value: function hasNext() {
      return !(0, _helper.isNilNode)(this.curr) || this.stack.length > 0;
    }
  }, {
    key: "next",
    value: function next() {
      while (!(0, _helper.isNilNode)(this.curr)) {
        this.stack.push(this.curr);
        this.curr = this.curr.left;
      }

      this.curr = this.stack.pop();
      var node = this.curr;
      this.curr = this.curr.right;
      return node.getValue();
    }
  }]);

  return iterator;
}();

var _default = iterator;
exports["default"] = _default;