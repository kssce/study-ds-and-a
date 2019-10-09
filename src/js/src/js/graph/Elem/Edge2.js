class Edge {
  constructor (prevVertex, currVertex, cost) {
    this.prevVertex = prevVertex; // start vertex
    this.currVertex = currVertex; // end vertex
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
