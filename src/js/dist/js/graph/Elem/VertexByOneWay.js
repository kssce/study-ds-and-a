"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helper = require("../../lib/helper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VertexByOneWay = function VertexByOneWay() {
  var _this = this;

  var _key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var cost = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  _classCallCheck(this, VertexByOneWay);

  this.getKey = function () {
    return _this.key;
  };

  this.getVal = function () {
    return _this.val;
  };

  this.setKey = function (key) {
    _this.key = key;
  };

  this.setVal = function (val) {
    _this.val = val;
  };

  this.getAdjList = function () {
    return _this.adjList;
  };

  this.linkVertex = function (targetVertex) {
    var key = targetVertex.getKey();

    var alreadyExists = _this.adjList.some(function (adjVertex) {
      return adjVertex.getKey() === key;
    });

    if (!alreadyExists) {
      // todo Implement adjVertex as a hashtable if the key is unique.
      _this.adjList.push(targetVertex);

      console.log("".concat(_this.key, " -> ").concat(key)); // targetVertex.linkNode(this);

      return true;
    }

    return false;
  };

  this.visit = function () {
    console.log("".concat(_this.key, " is visited")); // console.log(this.adjList.map(adj => adj.getKey()));

    _this.visited = true;
  };

  this.isVisited = function () {
    return _this.visited;
  };

  if (!(0, _helper.isExists)(_key, _val)) {
    console.error('not exists key or val.');
    return null;
  }

  this.key = _key;
  this.val = _val;
  this.visited = false;
  this.adjList = [];
};

var _default = VertexByOneWay;
exports["default"] = _default;