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

export default Edge;
