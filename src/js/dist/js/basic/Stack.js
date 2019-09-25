"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stack = function Stack() {
  var _this = this;

  _classCallCheck(this, Stack);

  this.push = function (item) {
    _this.arr.push(item);
  };

  this.pop = function () {
    return _this.arr.pop();
  };

  this.peek = function () {
    return _this.arr[_this.arr.length - 1];
  };

  this.isEmpty = function () {
    return _this.arr.length === 0;
  };

  this.arr = [];
};