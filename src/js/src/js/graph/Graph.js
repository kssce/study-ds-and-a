import { isExists } from '../lib/helper';
import Stack from '../basic/Stack';
import Queue from '../basic/Queue';
import Node from './Elem/VertexForBFS';

class Graph {
  constructor() {
    this.nodeMap = this.init();
  }

  bfs = () => {
    const queue = new Queue();
    let node = this.nodeMap.A;
    queue.enqueue(node);

    while (!queue.isEmpty()) {
      node = queue.dequeue();
      if (node.isVisited()) continue;

      node.visit();
      node.getAdjList().forEach(adjNode => {
        if (!adjNode.isVisited()) {
          queue.enqueue(adjNode);
        }
      });
    }
  };

  dfs = () => {
    const stack = new Stack();
    let node = this.nodeMap.A;

    stack.push(node);

    while (!stack.isEmpty()) {
      node = stack.pop();
      if (node.isVisited()) continue;

      node.visit();
      node.getAdjList().forEach(adjNode => {
        if (!adjNode.isVisited()) {
          stack.push(adjNode);
        }
      });
    }
  };



  init = (nodeMap) => {
    console.log('---------------------------------');
    const A = new Node('A', 1);
    const B = new Node('B', 2);
    const C = new Node('C', 3);
    const D = new Node('D', 4);
    const E = new Node('E', 5);
    const F = new Node('F', 6);
    const G = new Node('G', 7);
    A.linkNode(B);
    A.linkNode(C);
    A.linkNode(D);
    B.linkNode(C);
    C.linkNode(A);
    C.linkNode(D);
    E.linkNode(F);
    G.linkNode(F);
    B.linkNode(F);
    D.linkNode(E);
    return { A, B, C, D, E, F, G };
  };
}

const g = new Graph();
// g.dfs();
g.bfs();