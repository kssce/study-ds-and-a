class Vertex {
  constructor (key, data) {
    this.key = key;
    this.data = data;
  }
  getKey = () => this.key;
  getData = () => this.data;
}

export default Vertex;
