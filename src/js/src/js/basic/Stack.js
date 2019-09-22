class Stack {
  constructor() { this.arr = []; }

  push = (item) => { this.arr.push(item) };

  pop = () => this.arr.pop();

  peek = () => {
    const lastIdx = this.arr.length - 1;
    return this.arr[lastIdx];
  };

  isEmpty = () => this.arr.length === 0;
}