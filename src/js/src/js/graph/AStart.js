class AStar {
  constructor () {

  }

  init = () => {

  };

  aStar = () => {

  };

}





// [ Test code ]
console.log('----------- [ Initialize ] ------------');
const V_A = new Vertex('A', 1);
const V_B = new Vertex('B', 2);
const V_C = new Vertex('C', 3);
const V_D = new Vertex('D', 4);
const V_E = new Vertex('E', 5);
const V_F = new Vertex('F', 6);
// V_A.link(V_C, 6);
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




const a = new AStar([V_A, V_B, V_C, V_D, V_E]);
const startVertex = V_A;
const endVertex = V_C;

console.log('----------- [ Process ] ------------');
// const costMap = d.getByBFS(startVertex);
const costMap = a.aStar(startVertex, endVertex);



console.log('----------- [ Result ] ------------');
a.printPath(costMap);
