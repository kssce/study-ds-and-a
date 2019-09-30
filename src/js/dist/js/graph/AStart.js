"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _VertexByTwoWay2 = _interopRequireDefault(require("./Elem/VertexByTwoWay"));

var _PQueue = _interopRequireDefault(require("../basic/PQueue"));

var _Edge = _interopRequireDefault(require("./Elem/Edge2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var defaultHeuristic = function defaultHeuristic(sV, eV) {
  var posX = sV.getX(),
      posY = sV.getY();
  var endX = eV.getX(),
      endY = eV.getY();
  var weight = 1;
  var dx = Math.abs(posX - endX);
  var dy = Math.abs(posY - endY); // return weight * (Math.sqrt(Math.pow(posX - endX, 2) + Math.pow(posY - endY, 2)));

  return Math.abs(posX - endX) + Math.abs(posY - endY);
};

var Vertex =
/*#__PURE__*/
function (_VertexByTwoWay) {
  _inherits(Vertex, _VertexByTwoWay);

  function Vertex(_key, val, x, y) {
    var _this;

    _classCallCheck(this, Vertex);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Vertex).call(this, _key, val));

    _this.link = function (targetVertex, cost) {
      var key = targetVertex.getKey();

      var alreadyExists = _this.adjList.some(function (adjEdge) {
        return adjEdge.getCurrVertex().getKey() === key;
      });

      if (!alreadyExists) {
        _this.adjList.push(new _Edge["default"](_assertThisInitialized(_this), targetVertex, cost));

        console.log("".concat(_this.key, " -> ").concat(key));
        targetVertex.link(_assertThisInitialized(_this), cost);
        return true;
      }

      return false;
    };

    _this.getX = function () {
      return _this.x;
    };

    _this.getY = function () {
      return _this.y;
    };

    _this.getF = function () {
      return _this.f;
    };

    _this.getG = function () {
      return _this.g;
    };

    _this.setG = function (g) {
      _this.g = g;
      _this.f = _this.h + g;
    };

    _this.getH = function () {
      return _this.h;
    };

    _this.setH = function (h) {
      _this.h = h;
      _this.f = _this.g + h;
    };

    _this.setPrev = function (prev) {
      _this.prev = prev;
    };

    _this.getPrev = function () {
      return _this.prev;
    };

    _this.compareTo = function (target) {
      var targetFVal = target.getF();
      if (_this.f === Infinity && targetFVal === Infinity) return 0;
      return _this.f - targetFVal;
    };

    _this.x = x;
    _this.y = y;
    _this.h = 0;
    _this.g = Infinity;
    _this.f = _this.g + _this.h;
    _this.prev = null;
    return _this;
  }

  return Vertex;
}(_VertexByTwoWay2["default"]);

var AStar = function AStar() {
  var _this2 = this;

  _classCallCheck(this, AStar);

  this.setHeuristic = function (heuristic) {
    _this2.heuristic = heuristic;
  };

  this.init = function () {
    _this2.openList = new _PQueue["default"](100, function (a, b) {
      return a.compareTo(b) < 0;
    });
    _this2.closedList = {};
  };

  this.aStar = function (sV, eV) {
    sV.setH(_this2.heuristic(sV, eV));
    sV.setG(0);

    _this2.openList.enqueue(sV);

    var _loop2 = function _loop2() {
      var currV = _this2.openList.dequeue();

      var currFVal = currV.getF();
      if (currV.isVisited()) return "continue";
      var adjList = currV.getAdjList();
      var found = adjList.some(function (adj) {
        var nextV = adj.getCurrVertex();
        var nextFVal = nextV.getF();
        var accCost = currFVal + adj.getCost();

        if (accCost < nextFVal) {
          nextV.setG(accCost);
          nextV.setH(_this2.heuristic(nextV, eV));
          nextV.setPrev(currV);

          if (nextV === eV) {
            _this2.closedList[nextV.getKey()] = nextV;
            return true;
          }

          if (!nextV.isVisited()) {
            _this2.openList.enqueue(nextV);
          }
        }
      });
      currV.visit();
      _this2.closedList[currV.getKey()] = currV;
      if (found) return "break";
    };

    _loop: while (!_this2.openList.isEmpty()) {
      var _ret = _loop2();

      switch (_ret) {
        case "continue":
          continue;

        case "break":
          break _loop;
      }
    }

    return _this2.closedList;
  };

  this.printPath = function (closedList) {
    console.log(_lodash["default"].map(closedList, function (vertex, key) {
      var rstStr = '';
      var prev = vertex.getPrev();

      while (prev) {
        rstStr += " <- ".concat(prev.getKey());
        prev = costMap[prev.getKey()];
        prev = prev && prev.getPrev();
      }

      if (vertex.getG() === Infinity) rstStr = ' is broken';
      return "total cost is F=".concat(vertex.getF(), ", G=").concat(vertex.getG(), ", H=").concat(vertex.getH(), " : ").concat(key).concat(rstStr);
    }).join('\n'));
  };

  this.openList = null;
  this.closeList = null;
  this.heuristic = defaultHeuristic;
  this.init();
}; // [ Test code ]


console.log('----------- [ Initialize ] ------------');
var V_A = new Vertex('A', 1, 0, 1);
var V_B = new Vertex('B', 2, 3, 0);
var V_C = new Vertex('C', 3, 4, 3);
var V_D = new Vertex('D', 4, 2, 6);
var V_E = new Vertex('E', 5, 8, 0);
var V_F = new Vertex('F', 6, 6, 7);
var V_G = new Vertex('G', 7, 9, 5);
V_A.link(V_B, 5.6);
V_A.link(V_D, 6.8);
V_B.link(V_C, 4.3);
V_D.link(V_C, 5.6);
V_B.link(V_E, 6.5);
V_D.link(V_F, 6.5);
V_C.link(V_F, 5.8);
V_C.link(V_G, 7);
V_F.link(V_G, 5.5);
V_E.link(V_G, 5.2);
var a = new AStar([V_A, V_B, V_C, V_D, V_E, V_F, V_G]);
var startVertex = V_A;
var endVertex = V_G;
console.log('----------- [ Process ] ------------');
var costMap = a.aStar(startVertex, endVertex);
console.log('----------- [ Result ] ------------');
a.printPath(costMap);