import { isExists } from '../../lib/helper';

class VertexByTwoWay {
  constructor (key = null, val = null) {
    if (!isExists(key, val)) {
      console.error('not exists key or val.');
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
    console.log(`${this.key} is visited`);
    // console.log(this.adjList.map(adj => adj.getKey()));
    this.visited = true;
  };

  isVisited = () => this.visited;
}

export default VertexByTwoWay;
