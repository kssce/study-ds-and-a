class Queue {
  constructor() { this.arr = []; }

  enqueue = (item) => { this.arr.push(item) };

  dequeue = () => this.arr.shift();

  head = () => this.arr[0];

  isEmpty = () => this.arr.length === 0;
}

export default Queue;
