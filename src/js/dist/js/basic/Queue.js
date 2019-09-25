"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function Queue() {
  var _this = this;

  _classCallCheck(this, Queue);

  this.enqueue = function (item) {
    _this.arr.push(item);
  };

  this.dequeue = function () {
    return _this.arr.shift();
  };

  this.isEmpty = function () {
    return _this.arr.length === 0;
  };

  this.arr = [];
};

var _default = Queue;
exports["default"] = _default;