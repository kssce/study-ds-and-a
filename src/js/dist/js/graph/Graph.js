"use strict";

var _helper = require("../lib/helper");

var _Stack = _interopRequireDefault(require("../basic/Stack"));

var _Queue = _interopRequireDefault(require("../basic/Queue"));

var _VertexForBFS = _interopRequireDefault(require("./Elem/VertexForBFS"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = function Graph() {
  var _this = this;

  _classCallCheck(this, Graph);

  this.bfs = function () {
    var queue = new _Queue["default"]();
    var node = _this.nodeMap.A;
    queue.enqueue(node);

    while (!queue.isEmpty()) {
      node = queue.dequeue();
      if (node.isVisited()) continue;
      node.visit();
      node.getAdjList().forEach(function (adjNode) {
        if (!adjNode.isVisited()) {
          queue.enqueue(adjNode);
        }
      });
    }
  };

  this.dfs = function () {
    var stack = new _Stack["default"]();
    var node = _this.nodeMap.A;
    stack.push(node);

    while (!stack.isEmpty()) {
      node = stack.pop();
      if (node.isVisited()) continue;
      node.visit();
      node.getAdjList().forEach(function (adjNode) {
        if (!adjNode.isVisited()) {
          stack.push(adjNode);
        }
      });
    }
  };

  this.init = function (nodeMap) {
    console.log('---------------------------------');
    var A = new _VertexForBFS["default"]('A', 1);
    var B = new _VertexForBFS["default"]('B', 2);
    var C = new _VertexForBFS["default"]('C', 3);
    var D = new _VertexForBFS["default"]('D', 4);
    var E = new _VertexForBFS["default"]('E', 5);
    var F = new _VertexForBFS["default"]('F', 6);
    var G = new _VertexForBFS["default"]('G', 7);
    A.linkNode(B);
    A.linkNode(C);
    A.linkNode(D);
    B.linkNode(C);
    C.linkNode(A);
    C.linkNode(D);
    E.linkNode(F);
    G.linkNode(F);
    B.linkNode(F);
    D.linkNode(E);
    return {
      A: A,
      B: B,
      C: C,
      D: D,
      E: E,
      F: F,
      G: G
    };
  };

  this.nodeMap = this.init();
};

var g = new Graph(); // g.dfs();

g.bfs();