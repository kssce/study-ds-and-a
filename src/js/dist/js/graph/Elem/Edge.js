"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = function Edge(v1, _v, cost) {
  var _this = this;

  _classCallCheck(this, Edge);

  this.getV1 = function () {
    return _this.v1;
  };

  this.getV2 = function () {
    return _this.v2;
  };

  this.getCost = function () {
    return _this.cost;
  };

  this.compareTo = function (v2) {
    return _this.cost - v2.getCost();
  };

  this.v1 = v1;
  this.v2 = _v;
  this.cost = cost;
};

var _default = Edge;
exports["default"] = _default;