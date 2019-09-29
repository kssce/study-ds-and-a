import _ from 'lodash';
import Queue from '../basic/Queue';
import PQueue from '../basic/PQueue';
import VertexByOneWay from './Elem/VertexByOneWay';



class SetByMin {
  constructor (getter) {
    this.arr = [];
    this.getter = getter;
  }

  push = (data) => { this.arr.push(data); };
  popByMin = () => {
    let minIdx = 0, min = Infinity;
    this.arr.forEach((data, idx) => {
      const currData = this.getter(data);
      if (min > currData) {
        min = currData;
        minIdx = idx;
      }
    });
    return this.arr.splice(minIdx, 1)[0] || null;
  };

  isEmpty = () => !this.arr.length;
}



class Edge {
  constructor (prevVertex, currVertex, cost) {
    this.prevVertex = prevVertex; // sVertex: 시작 정점 (출발지)
    this.currVertex = currVertex; // eVertex: 종료 정점 (목적지)
    this.cost = cost;
  }
  getPrevVertex = () => this.prevVertex;
  setPrevVertex = (vertex) => { this.prevVertex = vertex };
  getCurrVertex = () => this.currVertex;
  getCost = () => this.cost;
  setCost = (cost) => { this.cost = cost };
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
    this.costMap = null; // { [key]: Edge,}
    this.unvisitedSet = null;
    this.vertexPQ = null;
    this.init();
  }

  init = () => {
    this.costMap = {};
    this.unvisitedSet = new SetByMin((data) => data.getCost());
    this.pQ = new PQueue(100, (a, b) => (a.compareTo(b) < 0)); // 오름차순 (a < b)

    this.vertexList.forEach(v => {
      const edge = new Edge(null, v, Infinity);
      this.costMap[v.getKey()] = edge;
      this.unvisitedSet.push(edge);
    }); // { val: Infinity, prev: null } });
  };

  getByBFS = (startVertex) => {
    this.init(startVertex);
    this.costMap[startVertex.getKey()].setCost(0);

    while (!this.unvisitedSet.isEmpty()) {
      const currEdge = this.unvisitedSet.popByMin();
      const currVertex = currEdge.getCurrVertex();

      if (currVertex.isVisited()) continue;

      const curAdjList = currVertex.getAdjList();

      curAdjList.forEach(adjEdge => {
        const nextVertex = adjEdge.getCurrVertex();
        const shortestNextCost = this.costMap[nextVertex.getKey()].getCost();
        const accCurrCost = adjEdge.getCost() + this.costMap[currVertex.getKey()].getCost();

        if (accCurrCost < shortestNextCost) {
          this.costMap[nextVertex.getKey()].setCost(accCurrCost);
          this.costMap[nextVertex.getKey()].setPrevVertex(currVertex);
        }
      });
      currVertex.visit();
    }
    return this.costMap;
  };

  getByPQ = (startVertex) => {
    this.init(startVertex);
    this.pQ.enqueue(new Edge(null, startVertex, 0));
    this.costMap[startVertex.getKey()].setCost(0);

    while (!this.pQ.isEmpty()) {
      const currEdge = this.pQ.dequeue();
      const currVertex = currEdge.getCurrVertex();

      if (currVertex.isVisited()) continue;

      const curAdjList = currVertex.getAdjList();

      curAdjList.forEach(adjEdge => {
        const nextVertex = adjEdge.getCurrVertex();
        const shortestNextCost = this.costMap[nextVertex.getKey()].getCost();
        const accCurrCost = adjEdge.getCost() + this.costMap[currVertex.getKey()].getCost();

        if (accCurrCost < shortestNextCost) {
          this.costMap[nextVertex.getKey()].setCost(accCurrCost);
          this.costMap[nextVertex.getKey()].setPrevVertex(currVertex);
          if (!nextVertex.isVisited()) {
            this.pQ.enqueue(adjEdge);
          }
        }
      });
      currVertex.visit();
    }
    return this.costMap;
  };

  printPath = (costMap) => {
    console.log(
      _.map(costMap, (vertex, key) => {
        let rstStr = '';
        let prev = vertex.getPrevVertex();
        while (prev) {
          rstStr += ` <- ${prev.getKey()}`;
          prev = costMap[prev.getKey()];
          prev = prev && prev.getPrevVertex();
        }
        if (vertex.getCost() === Infinity) rstStr = ' is broken';
        return `total cost is ${vertex.getCost()} : ${key}${rstStr}`;
      }).join('\n')
    );
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




const d = new Dijkstra([V_A, V_B, V_C, V_D, V_E]);
const startVertex = V_A;

console.log('----------- [ Process ] ------------');
// const costMap = d.getByBFS(startVertex);
const costMap = d.getByPQ(startVertex);



console.log('----------- [ Result ] ------------');
d.printPath(costMap);
