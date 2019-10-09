const M = 5;

const initByNull = (list) => {
  const len = list.length;
  for (let i = 0 ; i < len ; i ++) {
    list[i] = null;
  }
  return list;
};


class Data {
  constructor (data, key, left = null, right = null) {
    this._key = key;
    this._data = data;
    this._left = left; // left child
    this._right = right; // right child
  }

  getKey = () => this._key;
  setKey = (key) => { this._key = key; };
  getData = () => this._data;
  setData = (data) => { this._data = data; };
  getLeft = () => this._left;
  setLeft = (left) => { this._left = left; };
  getRight = () => this._right;
  setRight = (right) => { this._right = right; };
  compareTo = (target) => this._key - target.getKey();
}

class BTreeNode {
  constructor(degree = M) {
    this._dataList = initByNull(Array(M)); // Element by instance of Data
    this._children = initByNull(Array(M + 1));
    this._dataCnt = 0;
    this._degree = degree;
    this.proxy = (data) => ({ key: data, data });
  }

  isLeafNode = () => !this._children[0];

  increaseDataCnt = () => { this._dataCnt++; };

  decreaseDataCnt = () => { this._dataCnt--; };

  setProxy = (proxyMethod) => { this.proxy = proxyMethod; };

  isFull = () => ((this._dataCnt + 1) >= this._degree);

  initBy = (dataInstance) => {
    this._dataCnt = 1;
    this._dataList[0] = dataInstance;
    this._children[0] = dataInstance.getLeft();
    this._children[1] = dataInstance.getRight();
  };

  add = (rawData) => {
    const data = new Data(this.proxy(rawData).data, this.proxy(rawData).key);

    if (this.isLeafNode()) {
      return this.isFull() ? this.split(data) : this.insertData(data);

    } else {
      const childWithData = this.getChildWith(data);
      if (!childWithData) return null;
      const splittedChild = childWithData.add(data.getData());
      if (!splittedChild) return null;
      return this.isFull() ? this.split(splittedChild, splittedChild.getRight()) : this.insertSplittedChild(splittedChild);
    }
  };

  // insert data on self
  insertData = (dataToInsert) => {
    console.log(this.isLeafNode() ? 'leafNode' : 'internalNode');

    let dataIdx = this._dataCnt;
    const dataList = this._dataList;
    let prev = dataList[dataIdx - 1];
    while ((dataIdx > 0) && prev && (prev.compareTo(dataToInsert) > 0)) {
      dataList[dataIdx] = dataList[dataIdx - 1];
      dataIdx--;
      prev = dataList[dataIdx - 1];
    }

    dataList[dataIdx] = dataToInsert;
    this.increaseDataCnt();
    return null;
  };

  // 자신에게(내부 노드) 자식 노드의 중간 노드 삽입
  insertSplittedChild = (splittedChild) => {
    const child = splittedChild.getLeft();  // splitted child

    // insert key with right child poped up from child node

    // case A: first child was split
    if (child === this._children[0]) {
      for (let i = this._dataCnt; i > 0; i--) {
        this._dataList[i] = this._dataList[i - 1];
        this._children[i + 1] = this._children[i];
      }
      this._dataList[0] = splittedChild;
      this._children[0] = child;
      this._children[1] = splittedChild.getRight();
      // for (let i = this._dataCnt + 1; i > 1; i--) {
      //   this._children[i] = this._children[i - 1];
      // }
      // this._children[0] = child;
      // this._children[1] = splittedChild.getRight();
    }

    // case B: [key][split-child] (split child is on the right)
    else {
      let idx = this._dataCnt;
      while (idx > 0 && this._children[idx] !== child) {
        this._dataList[idx] = this._dataList[idx - 1];
        this._children[idx + 1] = this._children[idx];
        idx--;
      }
      this._dataList[idx] = splittedChild;
      this._children[idx + 1] = splittedChild.getRight();
    }

    this.increaseDataCnt();
  };

  getChildWith = (data) => {
    for (let i = 0; i < this._dataCnt; i++) {
      const currData = this._dataList[i];
      if (currData && (data.getKey() <= currData.getKey())) {
        return this._children[i];
      }
    }
    return this._children[this._dataCnt];
  };

  split = (data, rightChild = null) => {
    const left = this, right = new BTreeNode();

    const dataList = [...this._dataList], children = [...this._children];
    dataList.push(null);
    children.push(null);

    // insert data and children
    let idx = dataList.length - 1;
    let prevData = dataList[idx - 1];
    while (idx > 0 && prevData && prevData.compareTo(data) > 0) {
      dataList[idx] = prevData;
      children[idx + 1] = children[idx];
      idx--;
      prevData = dataList[idx - 1];
    }
    dataList[idx] = data;
    children[idx + 1] = rightChild;

    // split into two children and dataList
    const midIdx = Math.floor(dataList.length / 2);
    const midData = this._dataList[midIdx].getData();

    // fix left child dataList and children
    for (let i = 0; i < dataList.length; i++) {
      if (i < midIdx) {
        left._children[i] = children[i];
        left._dataList[i] = dataList[i];

      } else if (i === midIdx) {
        left._children[i] = children[i];
        left._dataList[i] = null;

      } else {
        left._children[i] = this._dataList[i] = null;
      }
    }
    left._dataCnt = midIdx;

    // fix right child dataList and children
    for (let i = 0; i < dataList.length - midIdx; i++) {
      right._dataList[i] = dataList[i + midIdx + 1];
      right._children[i] = children[i + midIdx + 1];
      right.increaseDataCnt();
    }
    right._children[dataList.length - midIdx - 1] = children[dataList.length];

    return new Data(this.proxy(midData).data, this.proxy(midData).key, left, right); // ({ left, key: midData, right });
  };

  remove = (data) => {

  };

  rebalance = (childIndex) => {

  };

  mergeChildren = (leftIndex) => {

  };

  extractMax = () => {

  };

  indexOfKey = () => {

  };

  removeKey = (key) => {

  };

  toString = (indentOpt) => {
    const INDENT_STRING = '  ';

    indentOpt = indentOpt || '';

    if (this.isLeafNode()) {
      return indentOpt + '[' + this._dataList.slice(0, this._dataCnt).join(', ') + ']';
    }

    let str = '';

    const childIndent = indentOpt + INDENT_STRING;
    const childStrings = this._children
      .slice(0, this._dataCnt + 1)
      .map((child) => {
        return child ? child.toString(childIndent) : '';
      });

    str = indentOpt + '[\n' + childStrings[0] + '\n';
    for (let i = 1; i < childStrings.length; i += 1) {
      const prevData = this._dataList[i - 1];
      str += childIndent + (prevData ? prevData.toString() : null) + '\n' +
        childStrings[i] + '\n';
    }
    str += indentOpt + ']';

    return str;
  };
}
BTreeNode.fromSplit = (split) => {
  const node = new BTreeNode();
  node.initBy(split);
  return node;
};


class BTree {
  constructor () {
    this._root = new BTreeNode();
  }

  add = (rawData) => {
    const curr = this._root;
    const split = curr.add(rawData);
    if (!split) return;
    this._root = BTreeNode.fromSplit(split);
  };

  remove = () => {

  };

  toString = () => this._root.toString();
}

const btree = new BTree();
const a1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20];
const a2 = [4,2,7,1,5,3,8];
const a = a1;

a.forEach((v) => {
  console.log('----------------------------------');
  console.log('ADDING ' + v + ' TO TREE');
  console.log('');

  btree.add(v);
  console.log(btree.toString());
});

// console.log(' --- BEFORE REMOVING --- ');
// console.log(btree.toString());
//
// a.forEach((v) => {
//   console.log('----------------------------------');
//   console.log('REMOVING ' + v + ' FROM TREE');
//   console.log('');
//
//   console.assert( btree.remove(v) );
//   console.log(btree.toString());
// });
