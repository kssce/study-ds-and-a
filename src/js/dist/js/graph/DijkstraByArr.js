"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _PQueue = _interopRequireDefault(require("../basic/PQueue"));

var _helper = require("../lib/helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * initialize array with val by ELEM_CNT * ELEM_CNT
 * @param ELEM_CNT
 * @param val
 * @returns {[]}
 */
var initBy = function initBy(ELEM_CNT, val) {
  var arr = [];

  _lodash["default"].times(ELEM_CNT, function () {
    var innerArr = [];

    _lodash["default"].times(ELEM_CNT, function () {
      innerArr.push(val);
    });

    arr.push(innerArr);
  });

  return arr;
};

var dijkstra = function dijkstra(graph, start) {
  // initialize distance list, visited list
  var dist = [];
  var visited = [];
  var rst = []; // data structure: { prev: previous vertex index, cost: shortest distance value }

  _lodash["default"].times(ELEM_CNT, function () {
    dist.push(Infinity);
    visited.push(false);
    rst.push({
      prev: null,
      cost: Infinity
    });
  });

  rst[start].cost = 0;
  dist[start] = 0; // initialize binary heap and enqueue first element

  var pQ = new _PQueue["default"](100, function (a, b) {
    return a.cost < b.cost;
  }); // ascending order

  pQ.enqueue({
    v: start,
    cost: dist[start]
  }); // data structure: { v: vertex index, cost: shortest distance value }

  var _loop = function _loop() {
    var currInfo = pQ.dequeue();
    var currVertex = currInfo.v;
    if (visited[currVertex]) return "continue";
    var curAdjList = graph[currVertex];
    curAdjList.forEach(function (cost, adjVertex) {
      if (cost === Infinity) return;
      var shortestAdjCost = dist[adjVertex];
      var accCurrCost = dist[currVertex] + cost;

      if (accCurrCost < shortestAdjCost) {
        dist[adjVertex] = accCurrCost;
        rst[adjVertex] = {
          prev: currVertex,
          cost: accCurrCost
        };

        if (!visited[adjVertex]) {
          pQ.enqueue({
            v: adjVertex,
            cost: accCurrCost
          });
        }
      }
    });
    visited[currVertex] = true;
  };

  while (!pQ.isEmpty()) {
    var _ret = _loop();

    if (_ret === "continue") continue;
  }

  return rst;
};

var printPath = function printPath(costList) {
  // costList = [{ prev: previous vertex idx, cost }]
  var alias = ['A', 'B', 'C', 'D', 'E'];
  console.log(costList.map(function (_ref, curr) {
    var prevIdx = _ref.prev,
        cost = _ref.cost;
    var rstStr = '';
    var prev = prevIdx;

    while ((0, _helper.isNotNull)(prev)) {
      rstStr += " <- ".concat(alias[prev]);
      prev = (0, _helper.isNotNull)(costList[prev]) ? costList[prev].prev : null;
    }

    if (cost === Infinity) rstStr = ' is broken';
    return "total cost is ".concat(cost, " : ").concat(alias[curr]).concat(rstStr);
  }).join('\n'));
}; // [ Test code ]


var A = 0,
    B = 1,
    C = 2,
    D = 3,
    E = 4;
var ELEM_CNT = 5;
var graph = initBy(ELEM_CNT, Infinity);
graph[A][B] = 10;
graph[A][C] = 5;
graph[B][C] = 2;
graph[C][B] = 3;
graph[B][D] = 1;
graph[C][D] = 9;
graph[C][E] = 2;
graph[E][A] = 7;
graph[E][D] = 6;
graph[D][E] = 4;
var costList = dijkstra(graph, A);
console.log('----------- [ Result ] ------------');
console.log(costList);
printPath(costList);