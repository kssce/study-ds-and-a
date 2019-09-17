"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isExists = function isExists() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.every(function (val) {
    return val !== null && val !== undefined;
  });
};

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
    var lastIdx = _this.arr.length - 1;
    return _this.arr[lastIdx];
  };

  this.isEmpty = function () {
    return _this.arr.length === 0;
  };

  this.arr = [];
};

var Queue = function Queue() {
  var _this2 = this;

  _classCallCheck(this, Queue);

  this.enqueue = function (item) {
    _this2.arr.push(item);
  };

  this.dequeue = function () {
    return _this2.arr.shift();
  };

  this.head = function () {
    return _this2.arr[0];
  };

  this.isEmpty = function () {
    return _this2.arr.length === 0;
  };

  this.arr = [];
};

var Node = function Node() {
  var _this3 = this;

  var _key2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  _classCallCheck(this, Node);

  this.getKey = function () {
    return _this3.key;
  };

  this.getVal = function () {
    return _this3.val;
  };

  this.setKey = function (key) {
    _this3.key = key;
  };

  this.setVal = function (val) {
    _this3.val = val;
  };

  this.getAdjList = function () {
    return _this3.adjList;
  };

  this.linkNode = function (targetNode) {
    var key = targetNode.getKey();

    var alreadyExists = _this3.adjList.some(function (adjNode) {
      return adjNode.getKey() === key;
    });

    if (!alreadyExists) {
      _this3.adjList.push(targetNode);

      console.log("".concat(_this3.key, " -> ").concat(key));
      targetNode.linkNode(_this3);
      return true;
    }

    return false;
  };

  this.visit = function () {
    console.log("".concat(_this3.key, " \uBC29\uBB38")); // console.log(this.adjList.map(adj => adj.getKey()));

    _this3.visited = true;
  };

  this.isVisited = function () {
    return _this3.visited;
  };

  if (!isExists(_key2, _val)) {
    console.error('ket 혹은 val 값이 없습니다.');
    return null;
  }

  this.key = _key2;
  this.val = _val;
  this.visited = false;
  this.adjList = [];
};

var Graph = function Graph() {
  var _this4 = this;

  _classCallCheck(this, Graph);

  this.bfs = function () {
    var queue = new Queue();
    var node = _this4.nodeMap.A;
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
    var stack = new Stack();
    var node = _this4.nodeMap.A;
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
    var A = new Node('A', 1);
    var B = new Node('B', 2);
    var C = new Node('C', 3);
    var D = new Node('D', 4);
    var E = new Node('E', 5);
    var F = new Node('F', 6);
    var G = new Node('G', 7);
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