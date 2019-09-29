"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AStar = function AStar() {
  _classCallCheck(this, AStar);

  this.init = function () {};

  this.aStar = function () {};
}; // [ Test code ]


console.log('----------- [ Initialize ] ------------');
var V_A = new Vertex('A', 1);
var V_B = new Vertex('B', 2);
var V_C = new Vertex('C', 3);
var V_D = new Vertex('D', 4);
var V_E = new Vertex('E', 5);
var V_F = new Vertex('F', 6); // V_A.link(V_C, 6);
// V_A.link(V_D, 3);
// V_B.link(V_A, 3);
// V_C.link(V_D, 2);
// V_D.link(V_C, 1);
// V_D.link(V_B, 1);
// V_E.link(V_B, 4);
// V_E.link(V_D, 2);
// V_A.link(V_B, 10);
// V_A.link(V_C, 30);
// V_A.link(V_D, 15);
// V_B.link(V_E, 20);
// V_C.link(V_F, 5);
// V_D.link(V_C, 5);
// V_D.link(V_F, 20);
// V_F.link(V_D, 20);
// V_E.link(V_F, 20);

V_A.link(V_B, 10);
V_A.link(V_C, 5);
V_B.link(V_C, 2);
V_C.link(V_B, 3);
V_B.link(V_D, 1);
V_C.link(V_D, 9);
V_C.link(V_E, 2);
V_E.link(V_A, 7);
V_E.link(V_D, 6);
V_D.link(V_E, 4);
var a = new AStar([V_A, V_B, V_C, V_D, V_E]);
var startVertex = V_A;
var endVertex = V_C;
console.log('----------- [ Process ] ------------'); // const costMap = d.getByBFS(startVertex);

var costMap = a.aStar(startVertex, endVertex);
console.log('----------- [ Result ] ------------');
a.printPath(costMap);