class Edge {
  constructor (v1, v2, cost) {
    this.v1 = v1;
    this.v2 = v2;
    this.cost = cost;
  };
  getV1 = () => this.v1;
  getV2 = () => this.v2;
  getCost = () => this.cost;
  compareTo = (v2) => this.cost - v2.getCost();
}

export default Edge;
