"use strict";

var _UnionFind = _interopRequireDefault(require("./UnionFind"));

var _PQueue = _interopRequireDefault(require("../basic/PQueue"));

var _Edge = _interopRequireDefault(require("./Elem/Edge"));

var _Vertex = _interopRequireDefault(require("./Elem/Vertex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// O(E log V)
var Kruskal = function Kruskal(_edgeList, _vertexList) {
  var _this = this;

  _classCallCheck(this, Kruskal);

  this.init = function (edgeList, vertexList) {
    var _this$edgePQ;

    _this.edgePQ = new _PQueue["default"](100, function (a, b) {
      return a.getCost() < b.getCost();
    }); // 오름차순

    (_this$edgePQ = _this.edgePQ).enqueue.apply(_this$edgePQ, _toConsumableArray(edgeList));

    _this.uf = new _UnionFind["default"](vertexList);
  };

  this.MST = function () {
    var mst = [];

    while (!_this.edgePQ.isEmpty()) {
      var edge = _this.edgePQ.dequeue();

      console.log(edge);
      var v1 = edge.getV1();
      var v2 = edge.getV2();

      if (!_this.uf.areSetsTheseProc(v1, v2)) {
        _this.uf.union(v1, v2);

        mst.push(edge);
      }
    }

    return mst;
  };

  this.edgePQ = null;
  this.uf = null;
  this.init(_edgeList, _vertexList);
}; // [ Test code ]


var V_A = new _Vertex["default"]('A', 1);
var V_B = new _Vertex["default"]('B', 2);
var V_C = new _Vertex["default"]('C', 3);
var V_D = new _Vertex["default"]('D', 4);
var V_E = new _Vertex["default"]('E', 5);
var V_F = new _Vertex["default"]('F', 6);
var V_G = new _Vertex["default"]('G', 7);
var EDGE_LIST = Object.freeze([new _Edge["default"](V_A, V_B, 3), new _Edge["default"](V_A, V_C, 11), new _Edge["default"](V_A, V_D, 10), new _Edge["default"](V_B, V_E, 5), new _Edge["default"](V_C, V_E, 7), new _Edge["default"](V_C, V_F, 3), new _Edge["default"](V_D, V_F, 1), new _Edge["default"](V_E, V_G, 5), new _Edge["default"](V_C, V_G, 2), new _Edge["default"](V_F, V_G, 1)]);
var VERTEX_LIST = Object.freeze([V_A, V_B, V_C, V_D, V_E, V_F, V_G]);
var k = new Kruskal(EDGE_LIST, VERTEX_LIST);
var mst = k.MST();
console.log('----------- [ 이하 실행 결과 ] ------------');
console.log(mst);