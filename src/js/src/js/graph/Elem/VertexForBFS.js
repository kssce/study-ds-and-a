import { isExists } from '../../lib/helper';

class VertexForBFS {
  constructor (key = null, val = null) {
    if (!isExists(key, val)) {
      console.error('key 혹은 val 값이 없습니다.');
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

export default VertexForBFS;
