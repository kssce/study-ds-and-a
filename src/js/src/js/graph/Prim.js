import PQueue from '../basic/PQueue';
import UnionFind from './UnionFind';
import Vertex from './Elem/Vertex';
import Edge from './Elem/Edge';

class Prim {
  constructor (edgeList, vertexList) {
    this.edgePQ = null;
    this.init(edgeList, vertexList);
  }

  init = (edgeList, vertexList) => {
    this.edgePQ = new PQueue(100, (a, b) => (a.getCost() < b.getCost())); // 오름차순
    this.edgePQ.enqueue(...edgeList);
  };

  MST = () => {
    let mst = [];
    // todo
    return mst;
  };
}



// [ Test code ]
const V_A = new Vertex('A', 1);
const V_B = new Vertex('B', 2);
const V_C = new Vertex('C', 3);
const V_D = new Vertex('D', 4);
const V_E = new Vertex('E', 5);
const V_F = new Vertex('F', 6);
const V_G = new Vertex('G', 7);
const EDGE_LIST = Object.freeze([
  new Edge(V_A, V_B, 3),
  new Edge(V_A, V_C, 11),
  new Edge(V_A, V_D, 10),
  new Edge(V_B, V_E, 5),
  new Edge(V_C, V_E, 7),
  new Edge(V_C, V_F, 3),
  new Edge(V_D, V_F, 1),
  new Edge(V_E, V_G, 5),
  new Edge(V_C, V_G, 2),
  new Edge(V_F, V_G, 1),
]);
const VERTEX_LIST = Object.freeze([ V_A, V_B, V_C, V_D, V_E, V_F, V_G ]);

const k = new Prim(EDGE_LIST, VERTEX_LIST);
const mst = k.MST();
console.log('----------- [ 이하 실행 결과 ] ------------');
console.log(mst);
