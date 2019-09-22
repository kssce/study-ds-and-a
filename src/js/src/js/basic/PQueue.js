const top = 0;
const parent = i => Math.floor((i + 1) / 2) - 1;
const left = i => (i * 2) + 1;
const right = i => (i + 1) * 2;

// 우선순위 큐
class PQueue {
  constructor (maxSize = 10, comparator = (a, b) => (a > b)) { // a > b === 내림차순
    this.data = [];
    this.maxSize = maxSize;
    this.comparator = comparator;
  }
  isEmpty = () => (this.size() === 0);

  isFull = () => (this.data.length === this.maxSize);

  size = () => (this.data.length);

  peek = () => (this.data[top]);

  clear = () => { this.data = []; };

  enqueue = (...values) => {
    values.forEach((value) => {
      this.data.push(value);
      this.shiftUp();
    });
    return this.size();
  };

  dequeue = () => {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this.swap(top, bottom);
    }
    this.data.pop();
    this.shiftDown();
    return poppedValue;
  };

  replace = (value) => {
    const replacedValue = this.peek();
    this.data[top] = value;
    this.shiftDown();
    return replacedValue;
  };

  greater = (i, j) => {
    return this.comparator(this.data[i], this.data[j]);
  };

  swap = (i, j) => {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  };

  shiftUp = () => {
    let node = this.size() - 1;
    while (node > top && this.greater(node, parent(node))) {
      this.swap(node, parent(node));
      node = parent(node);
    }
  };

  shiftDown = () => {
    let node = top;
    while (
      (left(node) < this.size() && this.greater(left(node), node)) ||
      (right(node) < this.size() && this.greater(right(node), node))
      ) {
      let maxChild = (right(node) < this.size() && this.greater(right(node), left(node)))
        ? right(node) : left(node);

      this.swap(node, maxChild);
      node = maxChild;
    }
  };

  print = (title) => {
    console.log(`---------- ${title} ----------`);
    const tempData = [...this.data];
    while (this.isEmpty()) {
      console.log(this.data.pop());
    }
    this.data.push(tempData);
  };
}

export default PQueue;
