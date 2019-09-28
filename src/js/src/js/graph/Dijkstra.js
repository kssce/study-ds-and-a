import _ from 'lodash';
import Queue from '../basic/Queue';
import PQueue from '../basic/PQueue';
import VertexByOneWay from './Elem/VertexByOneWay';



// Duplication Edge in Prim.js
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

class Vertex extends VertexByOneWay {
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
      return true;
    }
    return false;
  };
}



class Dijkstra {
  constructor (vertexList) {
    this.vertexList = vertexList;
    this.costMap = null;
    this.unvisitedQ = null;
    this.vertexPQ = null;
    this.init();
  }

  init = () => {
    this.costMap = {};
    this.vertexList.forEach(v => { this.costMap[v.getKey()] = { val: Infinity, prev: null } });

    this.unvisitedQ = new Queue();

    this.vertexPQ = new PQueue(100, (a, b) => (a.compareTo(b) < 0)); // 오름차순 (a < b)
  };

  linkToTree = (prevVertex, currVertex) => {
    if (!prevVertex) return;

    const newPrevVertex = new VertexByOneWay(prevVertex.getKey(), prevVertex.getVal());
    const newCurrVertex = new VertexByOneWay(currVertex.getKey(), currVertex.getVal());
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

  getByBFS = (startVertex) => {
    this.init(startVertex);
    this.unvisitedQ.enqueue(new Edge(null, startVertex, 0));
    this.costMap[startVertex.getKey()].val = 0;

    while (!this.unvisitedQ.isEmpty()) {
      const currEdge = this.unvisitedQ.dequeue();
      const currVertex = currEdge.getCurrVertex();

      if (currVertex.isVisited()) continue;
      currVertex.visit();

      const curAdjList = currVertex.getAdjList();

      curAdjList.forEach(adjEdge => {
        const nextVertex = adjEdge.getCurrVertex();
        const shortestNextCost = this.costMap[nextVertex.getKey()].val;
        const accCurrCost = adjEdge.getCost() + this.costMap[currVertex.getKey()].val;

        if (accCurrCost < shortestNextCost) {
          this.costMap[nextVertex.getKey()].val = accCurrCost;
          this.costMap[nextVertex.getKey()].prev = currVertex;
        }

        if (!nextVertex.isVisited()) {
          this.unvisitedQ.enqueue(adjEdge);
        }
      });
    }
    return this.costMap;
  };

  printPath = (costMap) => {
    console.log(
      _.map(costMap, (vertex, key) => {
        let rstStr = '';
        let prev = vertex.prev;
        while (prev) {
          rstStr += ` <- ${prev.getKey()}`;
          prev = costMap[prev.getKey()];
          prev = prev && prev.prev;
        }
        if (vertex.val === Infinity) rstStr = ' is broken';
        return `total cost is ${vertex.val} : ${key}${rstStr}`;
      }).join('\n')
    );
  };

  getByPQ = (startVertex) => {
    this.init();

  };
}



// [ Test code ]
console.log('----------- [ Initialize ] ------------');
const V_A = new Vertex('A', 1);
const V_B = new Vertex('B', 2);
const V_C = new Vertex('C', 3);
const V_D = new Vertex('D', 4);
const V_E = new Vertex('E', 5);
V_A.link(V_C, 6);
V_A.link(V_D, 3);
V_B.link(V_A, 3);
V_C.link(V_D, 2);
V_D.link(V_C, 1);
V_D.link(V_B, 1);
V_E.link(V_B, 4);
V_E.link(V_D, 2);



const d = new Dijkstra([V_A, V_B, V_C, V_D, V_E]);
const startVertex = V_A;

console.log('----------- [ Process ] ------------');
const costMap = d.getByBFS(startVertex);



console.log('----------- [ Result ] ------------');
d.printPath(costMap);
