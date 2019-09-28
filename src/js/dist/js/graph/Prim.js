"use strict";

var _PQueue = _interopRequireDefault(require("../basic/PQueue"));

var _VertexByTwoWay2 = _interopRequireDefault(require("./Elem/VertexByTwoWay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = function Edge(prevVertex, currVertex, cost) {
  var _this = this;

  _classCallCheck(this, Edge);

  this.getPrevVertex = function () {
    return _this.prevVertex;
  };

  this.getCurrVertex = function () {
    return _this.currVertex;
  };

  this.getCost = function () {
    return _this.cost;
  };

  this.compareTo = function (target) {
    return _this.cost - target.getCost();
  };

  this.prevVertex = prevVertex; // sVertex: 시작 정점 (출발지)

  this.currVertex = currVertex; // eVertex: 종료 정점 (목적지)

  this.cost = cost;
};

var Vertex =
/*#__PURE__*/
function (_VertexByTwoWay) {
  _inherits(Vertex, _VertexByTwoWay);

  function Vertex(_key, val) {
    var _this2;

    _classCallCheck(this, Vertex);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Vertex).call(this, _key, val));

    _this2.link = function (targetVertex, cost) {
      var key = targetVertex.getKey();

      var alreadyExists = _this2.adjList.some(function (adjEdge) {
        return adjEdge.getCurrVertex().getKey() === key;
      });

      if (!alreadyExists) {
        _this2.adjList.push(new Edge(_assertThisInitialized(_this2), targetVertex, cost));

        console.log("".concat(_this2.key, " -> ").concat(key));
        targetVertex.link(_assertThisInitialized(_this2), cost);
        return true;
      }

      return false;
    };

    return _this2;
  }

  return Vertex;
}(_VertexByTwoWay2["default"]);

var Prim = function Prim() {
  var _this3 = this;

  _classCallCheck(this, Prim);

  this.linkToTree = function (prevVertex, currVertex) {
    if (!prevVertex) return;
    var newPrevVertex = new _VertexByTwoWay2["default"](prevVertex.getKey(), prevVertex.getVal());
    var newCurrVertex = new _VertexByTwoWay2["default"](currVertex.getKey(), currVertex.getVal());
    newPrevVertex.linkNode(newCurrVertex);
  };

  this.enqueueUnvisitedVertexToPQueue = function (currVertex) {
    var adjList = currVertex.getAdjList();
    adjList.forEach(function (adjEdge) {
      if (!adjEdge.getCurrVertex().isVisited()) {
        _this3.vertexPQ.enqueue(adjEdge);
      }
    });
  };

  this.MST = function (startVertex) {
    var totalCost = 0;

    _this3.vertexPQ.enqueue(new Edge(null, startVertex, 0));

    while (!_this3.vertexPQ.isEmpty()) {
      var currEdge = _this3.vertexPQ.peek();

      var currVertex = currEdge.getCurrVertex();
      var prevVertex = currEdge.getPrevVertex();

      _this3.vertexPQ.dequeue();

      if (!currVertex.isVisited()) {
        currVertex.visit();

        _this3.linkToTree(prevVertex, currVertex);

        _this3.enqueueUnvisitedVertexToPQueue(currVertex);

        totalCost += currEdge.getCost();
      }
    }

    return {
      tree: startVertex,
      totalCost: totalCost
    };
  };

  this.vertexPQ = new _PQueue["default"](100, function (a, b) {
    return a.compareTo(b) < 0;
  }); // 오름차순 (a < b)
}; // [ Test code ]


console.log('----------- [ 초기화 ] ------------');
var V_A = new Vertex('A', 1);
var V_B = new Vertex('B', 2);
var V_C = new Vertex('C', 3);
var V_D = new Vertex('D', 4);
var V_E = new Vertex('E', 5);
var V_F = new Vertex('F', 6);
var V_G = new Vertex('G', 7);
var V_H = new Vertex('H', 8);
V_A.link(V_B, 5);
V_A.link(V_D, 3);
V_A.link(V_E, 4);
V_D.link(V_B, 3);
V_D.link(V_E, 3);
V_D.link(V_H, 5);
V_D.link(V_F, 3);
V_B.link(V_H, 2);
V_E.link(V_F, 2);
V_D.link(V_C, 3);
V_F.link(V_G, 6);
V_C.link(V_G, 4);
V_H.link(V_G, 3);
var p = new Prim();
var startVertex = V_A;
console.log('----------- [ 과정 ] ------------');

var _p$MST = p.MST(startVertex),
    tree = _p$MST.tree,
    totalCost = _p$MST.totalCost;

console.log('----------- [ 실행 결과 ] ------------');
console.log(" > totalCost: ".concat(totalCost));