import PQueue from '../basic/PQueue';
import VertexByTwoWay from './Elem/VertexByTwoWay';



class Edge {
  constructor (prevVertex, currVertex, cost) {
    this.prevVertex = prevVertex; // sVertex: 시작 정점 (출발지)
    this.currVertex = currVertex; // eVertex: 종료 정점 (목적지)
    this.cost = cost;
  }
  getPrevVertex = () => this.prevVertex;
  getCurrVertex = () => this.currVertex;
  getCost = () => this.cost;
  compareTo = (target) => this.cost - target.getCost();
}

class Vertex extends VertexByTwoWay {
  constructor (key, val) {
    super(key, val);
  }

  link = (targetVertex, cost) => {
    const key = targetVertex.getKey();
    const alreadyExists = this.adjList.some(adjEdge => {
      return adjEdge.getCurrVertex().getKey() === key;
    });

    if (!alreadyExists) {
      this.adjList.push(new Edge(this, targetVertex, cost));
      console.log(`${this.key} -> ${key}`);
      targetVertex.link(this, cost);
      return true;
    }
    return false;
  };
}



class Prim {
  constructor () {
    this.vertexPQ = new PQueue(100, (a, b) => (a.compareTo(b) < 0)); // 오름차순 (a < b)
  }

  linkToTree = (prevVertex, currVertex) => {
    if (!prevVertex) return;

    const newPrevVertex = new VertexByTwoWay(prevVertex.getKey(), prevVertex.getVal());
    const newCurrVertex = new VertexByTwoWay(currVertex.getKey(), currVertex.getVal());
    newPrevVertex.linkNode(newCurrVertex);
  };

  enqueueUnvisitedVertexToPQueue = (currVertex) => {
    const adjList = currVertex.getAdjList();

    adjList.forEach(adjEdge => {
      if (!adjEdge.getCurrVertex().isVisited()) {
        this.vertexPQ.enqueue(adjEdge);
      }
    });
  };

  MST = (startVertex) => {
    let totalCost = 0;
    this.vertexPQ.enqueue(new Edge(null, startVertex, 0));

    while (!this.vertexPQ.isEmpty()) {
      const currEdge = this.vertexPQ.peek();
      const currVertex = currEdge.getCurrVertex();
      const prevVertex = currEdge.getPrevVertex();
      this.vertexPQ.dequeue();

      if (!currVertex.isVisited()) {
        currVertex.visit();
        this.linkToTree(prevVertex, currVertex);
        this.enqueueUnvisitedVertexToPQueue(currVertex);
        totalCost += currEdge.getCost();
      }
    }

    return { tree: startVertex, totalCost };
  };
}

// VertexByOneWay

// [ Test code ]
console.log('----------- [ 초기화 ] ------------');
const V_A = new Vertex('A', 1);
const V_B = new Vertex('B', 2);
const V_C = new Vertex('C', 3);
const V_D = new Vertex('D', 4);
const V_E = new Vertex('E', 5);
const V_F = new Vertex('F', 6);
const V_G = new Vertex('G', 7);
const V_H = new Vertex('H', 8);
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


const p = new Prim();
const startVertex = V_A;
console.log('----------- [ 과정 ] ------------');
const { tree, totalCost } = p.MST(startVertex);

console.log('----------- [ 실행 결과 ] ------------');
console.log(` > totalCost: ${totalCost}`);
