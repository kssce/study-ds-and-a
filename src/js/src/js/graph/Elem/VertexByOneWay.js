import { isExists } from '../../lib/helper';

class VertexByOneWay {
  constructor (key = null, val = null, cost = null) {
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

  linkVertex = (targetVertex) => {
    const key = targetVertex.getKey();
    const alreadyExists = this.adjList.some(adjVertex => adjVertex.getKey() === key);

    if (!alreadyExists) { // key가 유일하다면 adjVertex 를 해시테이블로 구현할 것
      this.adjList.push(targetVertex);
      console.log(`${this.key} -> ${key}`);
      // targetVertex.linkNode(this);
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

export default VertexByOneWay;
