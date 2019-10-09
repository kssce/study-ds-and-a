"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = function Edge(prevVertex, currVertex, _cost) {
  var _this = this;

  _classCallCheck(this, Edge);

  this.getPrevVertex = function () {
    return _this.prevVertex;
  };

  this.setPrevVertex = function (vertex) {
    _this.prevVertex = vertex;
  };

  this.getCurrVertex = function () {
    return _this.currVertex;
  };

  this.getCost = function () {
    return _this.cost;
  };

  this.setCost = function (cost) {
    _this.cost = cost;
  };

  this.compareTo = function (target) {
    return _this.cost - target.getCost();
  };

  this.prevVertex = prevVertex; // start vertex

  this.currVertex = currVertex; // end vertex

  this.cost = _cost;
};

var _default = Edge;
exports["default"] = _default;