"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var top = 0;

var parent = function parent(i) {
  return Math.floor((i + 1) / 2) - 1;
};

var left = function left(i) {
  return i * 2 + 1;
};

var right = function right(i) {
  return (i + 1) * 2;
}; // 우선순위 큐


var PQueue = function PQueue() {
  var _this = this;

  var maxSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a, b) {
    return a > b;
  };

  _classCallCheck(this, PQueue);

  this.isEmpty = function () {
    return _this.size() === 0;
  };

  this.isFull = function () {
    return _this.data.length === _this.maxSize;
  };

  this.size = function () {
    return _this.data.length;
  };

  this.peek = function () {
    return _this.data[top];
  };

  this.clear = function () {
    _this.data = [];
  };

  this.enqueue = function () {
    for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    values.forEach(function (value) {
      _this.data.push(value);

      _this.shiftUp();
    });
    return _this.size();
  };

  this.dequeue = function () {
    var poppedValue = _this.peek();

    var bottom = _this.size() - 1;

    if (bottom > top) {
      _this.swap(top, bottom);
    }

    _this.data.pop();

    _this.shiftDown();

    return poppedValue;
  };

  this.replace = function (value) {
    var replacedValue = _this.peek();

    _this.data[top] = value;

    _this.shiftDown();

    return replacedValue;
  };

  this.greater = function (i, j) {
    return _this.comparator(_this.data[i], _this.data[j]);
  };

  this.swap = function (i, j) {
    var _ref = [_this.data[j], _this.data[i]];
    _this.data[i] = _ref[0];
    _this.data[j] = _ref[1];
  };

  this.shiftUp = function () {
    var node = _this.size() - 1;

    while (node > top && _this.greater(node, parent(node))) {
      _this.swap(node, parent(node));

      node = parent(node);
    }
  };

  this.shiftDown = function () {
    var node = top;

    while (left(node) < _this.size() && _this.greater(left(node), node) || right(node) < _this.size() && _this.greater(right(node), node)) {
      var maxChild = right(node) < _this.size() && _this.greater(right(node), left(node)) ? right(node) : left(node);

      _this.swap(node, maxChild);

      node = maxChild;
    }
  };

  this.print = function (title) {
    console.log("---------- ".concat(title, " ----------"));

    var tempData = _toConsumableArray(_this.data);

    while (_this.isEmpty()) {
      console.log(_this.data.pop());
    }

    _this.data.push(tempData);
  };

  // a > b === 내림차순
  this.data = [];
  this.maxSize = maxSize;
  this.comparator = comparator;
};

var _default = PQueue;
exports["default"] = _default;