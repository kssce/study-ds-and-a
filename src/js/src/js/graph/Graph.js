const isExists = (...args) => (args.every(val => val !== null && val !== undefined));

class Stack {
  constructor() { this.arr = []; }

  push = (item) => { this.arr.push(item) };

  pop = () => this.arr.pop();

  peek = () => {
    const lastIdx = this.arr.length - 1;
    return this.arr[lastIdx];
  };

  isEmpty = () => this.arr.length === 0;
}

class Queue {
  constructor() { this.arr = []; }

  enqueue = (item) => { this.arr.push(item) };

  dequeue = () => this.arr.shift();

  head = () => this.arr[0];

  isEmpty = () => this.arr.length === 0;
}


class Node {
  constructor (key = null, val = null) {
    if (!isExists(key, val)) {
      console.error('ket 혹은 val 값이 없습니다.');
      return null;
    }
    this.key = key;
    this.val = val;
    this.visited = false;
    this.adjList = [];
  }

  getKey = () => this.key;
  getVal = () => this.val;
  setKey = (key) => { this.key = key; };
  setVal = (val) => { this.val = val; };

  getAdjList = () => this.adjList;

  linkNode = (targetNode) => {
    const key = targetNode.getKey();
    const alreadyExists = this.adjList.some(adjNode => adjNode.getKey() === key);

    if (!alreadyExists) {
      this.adjList.push(targetNode);
      console.log(`${this.key} -> ${key}`);
      targetNode.linkNode(this);
      return true;
    }
    return false;
  };

  visit = () => {
    console.log(`${this.key} 방문`);
    // console.log(this.adjList.map(adj => adj.getKey()));
    this.visited = true;
  };

  isVisited = () => this.visited;
}

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