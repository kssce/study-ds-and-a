"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = function Vertex(key, data) {
  var _this = this;

  _classCallCheck(this, Vertex);

  this.getKey = function () {
    return _this.key;
  };

  this.getData = function () {
    return _this.data;
  };

  this.key = key;
  this.data = data;
};

var _default = Vertex;
exports["default"] = _default;