class Stack {
  constructor() { this.arr = []; }

  push = (item) => { this.arr.push(item) };

  pop = () => this.arr.pop();

  peek = () => this.arr[this.arr.length - 1];

  isEmpty = () => this.arr.length === 0;
}