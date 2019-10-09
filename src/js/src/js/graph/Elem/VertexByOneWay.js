import { isExists } from '../../lib/helper';

class VertexByOneWay {
  constructor (key = null, val = null, cost = null) {
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

  linkVertex = (targetVertex) => {
    const key = targetVertex.getKey();
    const alreadyExists = this.adjList.some(adjVertex => adjVertex.getKey() === key);

    if (!alreadyExists) { // todo Implement adjVertex as a hashtable if the key is unique.
      this.adjList.push(targetVertex);
      console.log(`${this.key} -> ${key}`);
      // targetVertex.linkNode(this);
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

export default VertexByOneWay;
