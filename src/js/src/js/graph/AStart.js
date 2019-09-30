import _ from 'lodash';
import VertexByTwoWay from './Elem/VertexByTwoWay';
import PQueue from '../basic/PQueue';
import Edge from './Elem/Edge2';


const defaultHeuristic = (sV, eV) => {
  const posX = sV.getX(), posY = sV.getY();
  const endX = eV.getX(), endY = eV.getY();
  const weight = 1;
  const dx = Math.abs(posX - endX);
  const dy = Math.abs(posY - endY);
  // return weight * (Math.sqrt(Math.pow(posX - endX, 2) + Math.pow(posY - endY, 2)));
  return Math.abs(posX - endX) + Math.abs(posY - endY);
};


class Vertex extends VertexByTwoWay {
  constructor (key, val, x, y) {
    super(key, val);
    this.x = x;
    this.y = y;

    this.h = 0;
    this.g = Infinity;
    this.f = this.g + this.h;
    this.prev = null;
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

  getX = () => this.x;
  getY = () => this.y;
  getF = () => this.f;
  getG = () => this.g;
  setG = (g) => {
    this.g = g;
    this.f = this.h + g;
  };
  getH = () => this.h;
  setH = (h) => {
    this.h = h;
    this.f = this.g + h;
  };
  setPrev = (prev) => { this.prev = prev; };
  getPrev = () => this.prev;
  compareTo = (target) => {
    const targetFVal = target.getF();
    if (this.f === Infinity && targetFVal === Infinity) return 0;
    return this.f - targetFVal;
  }
}



class AStar {
  constructor () {
    this.openList = null;
    this.closeList = null;
    this.heuristic = defaultHeuristic;
    this.init();
  }

  setHeuristic = (heuristic) => { this.heuristic = heuristic; };

  init = () => {
    this.openList = new PQueue(100, (a, b) => (a.compareTo(b) < 0));
    this.closedList = {};
  };

  aStar = (sV, eV) => {
    sV.setH(this.heuristic(sV, eV));
    sV.setG(0);
    this.openList.enqueue(sV);

    while (!this.openList.isEmpty()) {
      const currV = this.openList.dequeue();
      const currFVal = currV.getF();

      if (currV.isVisited()) continue;

      const adjList = currV.getAdjList();

      const found = adjList.some(adj => {
        const nextV = adj.getCurrVertex();
        const nextFVal = nextV.getF();
        const accCost = currFVal + adj.getCost();

        if (accCost < nextFVal) {
          nextV.setG(accCost);
          nextV.setH(this.heuristic(nextV, eV));
          nextV.setPrev(currV);
          if (nextV === eV) {
            this.closedList[nextV.getKey()] = nextV;
            return true;
          }

          if (!nextV.isVisited()) {
            this.openList.enqueue(nextV);
          }
        }

      });
      currV.visit();
      this.closedList[currV.getKey()] = currV;
      if (found) break;
    }
    return this.closedList;
  };

  printPath = (closedList) => {
    console.log(
      _.map(closedList, (vertex, key) => {
        let rstStr = '';
        let prev = vertex.getPrev();
        while (prev) {
          rstStr += ` <- ${prev.getKey()}`;
          prev = costMap[prev.getKey()];
          prev = prev && prev.getPrev();
        }
        if (vertex.getG() === Infinity) rstStr = ' is broken';
        return `total cost is F=${vertex.getF()}, G=${vertex.getG()}, H=${vertex.getH()} : ${key}${rstStr}`;
      }).join('\n')
    );
  };
}





// [ Test code ]
console.log('----------- [ Initialize ] ------------');
const V_A = new Vertex('A', 1, 0, 1);
const V_B = new Vertex('B', 2, 3, 0);
const V_C = new Vertex('C', 3, 4, 3);
const V_D = new Vertex('D', 4, 2, 6);
const V_E = new Vertex('E', 5, 8, 0);
const V_F = new Vertex('F', 6, 6, 7);
const V_G = new Vertex('G', 7, 9, 5);

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



const a = new AStar([V_A, V_B, V_C, V_D, V_E, V_F, V_G]);
const startVertex = V_A;
const endVertex = V_G;

console.log('----------- [ Process ] ------------');
const costMap = a.aStar(startVertex, endVertex);


console.log('----------- [ Result ] ------------');
a.printPath(costMap);
