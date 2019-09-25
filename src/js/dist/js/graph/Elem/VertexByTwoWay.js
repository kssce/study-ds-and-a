"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helper = require("../../lib/helper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VertexByTwoWay = function VertexByTwoWay() {
  var _this = this;

  var _key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  _classCallCheck(this, VertexByTwoWay);

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

  this.linkNode = function (targetNode) {
    var key = targetNode.getKey();

    var alreadyExists = _this.adjList.some(function (adjNode) {
      return adjNode.getKey() === key;
    });

    if (!alreadyExists) {
      _this.adjList.push(targetNode);

      console.log("".concat(_this.key, " -> ").concat(key));
      targetNode.linkNode(_this);
      return true;
    }

    return false;
  };

  this.visit = function () {
    console.log("".concat(_this.key, " \uBC29\uBB38")); // console.log(this.adjList.map(adj => adj.getKey()));

    _this.visited = true;
  };

  this.isVisited = function () {
    return _this.visited;
  };

  if (!(0, _helper.isExists)(_key, _val)) {
    console.error('key 혹은 val 값이 없습니다.');
    return null;
  }

  this.key = _key;
  this.val = _val;
  this.visited = false;
  this.adjList = [];
};

var _default = VertexByTwoWay;
exports["default"] = _default;