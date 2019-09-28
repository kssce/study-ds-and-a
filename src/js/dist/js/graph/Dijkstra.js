"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _Queue = _interopRequireDefault(require("../basic/Queue"));

var _PQueue = _interopRequireDefault(require("../basic/PQueue"));

var _VertexByOneWay2 = _interopRequireDefault(require("./Elem/VertexByOneWay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Duplication Edge in Prim.js
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
function (_VertexByOneWay) {
  _inherits(Vertex, _VertexByOneWay);

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
        return true;
      }

      return false;
    };

    return _this2;
  }

  return Vertex;
}(_VertexByOneWay2["default"]);

var Dijkstra = function Dijkstra(vertexList) {
  var _this3 = this;

  _classCallCheck(this, Dijkstra);

  this.init = function () {
    _this3.costMap = {};

    _this3.vertexList.forEach(function (v) {
      _this3.costMap[v.getKey()] = {
        val: Infinity,
        prev: null
      };
    });

    _this3.unvisitedQ = new _Queue["default"]();
    _this3.vertexPQ = new _PQueue["default"](100, function (a, b) {
      return a.compareTo(b) < 0;
    }); // 오름차순 (a < b)
  };

  this.getByBFS = function (startVertex) {
    _this3.init(startVertex);

    _this3.unvisitedQ.enqueue(new Edge(null, startVertex, 0));

    _this3.costMap[startVertex.getKey()].val = 0;

    var _loop = function _loop() {
      var currEdge = _this3.unvisitedQ.dequeue();

      var currVertex = currEdge.getCurrVertex();
      if (currVertex.isVisited()) return "continue";
      currVertex.visit();
      var curAdjList = currVertex.getAdjList();
      curAdjList.forEach(function (adjEdge) {
        var nextVertex = adjEdge.getCurrVertex();

        var shortestNextCost = _this3.costMap[nextVertex.getKey()].val;

        var accCurrCost = adjEdge.getCost() + _this3.costMap[currVertex.getKey()].val;

        if (accCurrCost < shortestNextCost) {
          _this3.costMap[nextVertex.getKey()].val = accCurrCost;
          _this3.costMap[nextVertex.getKey()].prev = currVertex;
        }

        if (!nextVertex.isVisited()) {
          _this3.unvisitedQ.enqueue(adjEdge);
        }
      });
    };

    while (!_this3.unvisitedQ.isEmpty()) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }

    return _this3.costMap;
  };

  this.getByPQ = function (startVertex) {
    _this3.init();
  };

  this.printPath = function (costMap) {
    console.log(_lodash["default"].map(costMap, function (vertex, key) {
      var rstStr = '';
      var prev = vertex.prev;

      while (prev) {
        rstStr += " <- ".concat(prev.getKey());
        prev = costMap[prev.getKey()];
        prev = prev && prev.prev;
      }

      if (vertex.val === Infinity) rstStr = ' is broken';
      return "total cost is ".concat(vertex.val, " : ").concat(key).concat(rstStr);
    }).join('\n'));
  };

  this.vertexList = vertexList;
  this.costMap = null;
  this.unvisitedQ = null;
  this.vertexPQ = null;
  this.init();
}; // [ Test code ]


console.log('----------- [ Initialize ] ------------');
var V_A = new Vertex('A', 1);
var V_B = new Vertex('B', 2);
var V_C = new Vertex('C', 3);
var V_D = new Vertex('D', 4);
var V_E = new Vertex('E', 5);
V_A.link(V_C, 6);
V_A.link(V_D, 3);
V_B.link(V_A, 3);
V_C.link(V_D, 2);
V_D.link(V_C, 1);
V_D.link(V_B, 1);
V_E.link(V_B, 4);
V_E.link(V_D, 2);
var d = new Dijkstra([V_A, V_B, V_C, V_D, V_E]);
var startVertex = V_A;
console.log('----------- [ Process ] ------------');
var costMap = d.getByBFS(startVertex);
console.log('----------- [ Result ] ------------');
d.printPath(costMap);