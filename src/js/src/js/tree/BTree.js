import { EMPTY_OBJ} from '../lib/constant';
import { isNotNull } from '../lib/helper';
import Queue from '../basic/Queue';



const M = 4;

const initByNull = (list) => {
  const len = list.length;
  for (let i = 0 ; i < len ; i ++) {
    list[i] = null;
  }
  return list;
};



class BTreeNode {
  constructor (rawDatum = null, left = null, right = null, dim) {
    this._data = initByNull(Array(M));
    this._children = initByNull(Array(M + 1));
    this._dataCnt = isNotNull(rawDatum) ? 1 : 0;
    this._dim = dim; // dimention of tree
    this._data[0] = rawDatum;
    this._children[0] = left;
    this._children[1] = right;
    this.getMemOf = (datum) => ({ key: datum, val: datum });
    this.compareTo = (datumA, datumB) => (this.getMemOf(datumA).key - this.getMemOf(datumB).key);
  }

  isLeafNode = () => !this._children[0];

  setGetMemOf = (getMemOfMethod) => { this.getMemOf = getMemOfMethod; };

  isFull = () => (this._dataCnt >= this._dim);

  getDatumAt = (idx) => this._data[idx];

  getChildAt = (idx) => this._children[idx];

  getChildren = () => this._children;

  getLeftOf = (idx) => this._children[idx];

  setLeftOf = (idx, node) => { this._children[idx] = node; };

  getRightOf = (idx) => this._children[idx + 1];

  setRightOf = (idx, node) => { this._children[idx + 1] = node; };

  // divide data, children to half
  // return right of half
  divideBy = (pivotIdx) => {
    if (isNotNull(this._data[pivotIdx])) {
      let data = [], children = [];
      const childrenCnt = this._dataCnt + 1;

      for (let i = pivotIdx + 1; i < childrenCnt; i++) {
        children.push(this._children[i]);
        this._children[i] = null;

        if (i < this._dataCnt) {
          data.push(this._data[i]);
          this._data[i] = null;
          this._dataCnt--;
        }
      }
      // remove center datum
      this._data[pivotIdx] = null;
      this._dataCnt--;

      return { right: { data, children } };
    }
    return EMPTY_OBJ;
  };

  initBy = (data, children) => {
    const len = data.length;
    for (let i = 0; i < len ; i++) {
      this._data[i] = data[i];
      this._dataCnt++;
      this._children[i] = children[i];
    }
    this._children[len] = children[len] || null;
  };

  add = (datum, left = null, right = null) => {
    if (this.isFull()) return false;

    let i = this._dataCnt;

    while (i > 0 && this.compareTo(this._data[i - 1], datum) > 0) {
      this._data[i] = this._data[i - 1];
      this.setLeftOf(i + 1, this.getLeftOf(i));
      i--;
    }

    this._data[i] = datum;
    this.setLeftOf(i, left);
    this.setRightOf(i, right);
    this._dataCnt++;
    return true;
  };

  del = (delIdx) => {
    let i = delIdx + 1;
    if (i > this._dataCnt) return false;

    for (; i < this._dataCnt; i < this._dataCnt) {
      this._data[i - 1] = this._data[i];
      this.setLeftOf(i - 1, this.getLeftOf(i));
    }

    this.setLeftOf(i - 1, this.getLeftOf(i));
    this.setRightOf(i - 1, null);
    this._dataCnt--;
    return true;
  };

  find = (datum) => { // If not found, return idx of _children
    let lowerBound = 0, upperBound = this._dataCnt - 1;

    while (lowerBound <= upperBound) {
      const mid = Math.floor((upperBound + lowerBound) / 2); // Not allowed in other languages
      if (this.compareTo(this._data[mid], datum) > 0) upperBound = mid - 1;
      else if (this.compareTo(this._data[mid], datum) < 0) lowerBound = mid + 1;
      else return { idx: mid, isNotFound: false };
    }

    return { childIdx: upperBound + 1, isNotFound: true };
  };

  toString = () => this._data;
}



class BTree {
  constructor (dim = M) {
    this.dim = dim; // dimention
    this._root = null;
    this.length = 0;
  }

  find = (datum) => {
    let node = this._root;
    let foundRst = node.find(datum);

    while (node && foundRst.isNotFound) {
      node = node.getChildAt(foundRst.idx);
      foundRst = node.find(datum);
    }
    return node ? node[foundRst.idx] : null;
  };

  _split = (node) => {
    const left = node, right = new BTreeNode(null, null, null, this.dim);
    const t = Math.floor(this.dim / 2);
    const datumOfChild = left.getDatumAt(t);
    const dividedNode = node.divideBy(t).right; // set with left of splitted node to node. and get splitted right node

    if (!dividedNode) return EMPTY_OBJ;

    const { data, children } = dividedNode;
    right.initBy(data, children);

    return { datumOfChild, left, right };
  };

  insert = (rawDatum) => {
    const root = this._root;
    if (!root) {
      this._root = new BTreeNode(rawDatum, null, null, this.dim);
      return true;
    }

    const { datumOfChild, left, right }  = this.insertChildrenNode(rawDatum, null, root);
    this._root = isNotNull(datumOfChild) ? new BTreeNode(datumOfChild, left, right, this.dim) : root;
  };

  insertChildrenNode = (rawDatum, pNode, node) => {
    let foundInfo = node.find(rawDatum);
    if (!foundInfo.isNotFound) return EMPTY_OBJ;

    const cNode = node.getChildAt(foundInfo.childIdx);

    if (node.isLeafNode()) {
      node.add(rawDatum);
      this.length++;

    } else {
      const { datumOfChild, left, right } = this.insertChildrenNode(rawDatum, node, cNode);
      if (isNotNull(datumOfChild)) {
        node.add(datumOfChild, left, right);
      }
    }

    return node.isFull() ? this._split(node) : EMPTY_OBJ;
  };

  remove = () => {

  };

  print = () => {
    const q = new Queue();
    let curr = this._root;

    while (curr) {
      if (!curr.isLeafNode()) {
        console.log('\ncurrNode ', curr.toString());
        console.log('children nodes ', curr.getChildren().map(node => node && node.toString()));
        curr.getChildren().forEach(child => { isNotNull(child) && q.enqueue(child); });
      }
      curr = q.dequeue();
    }
  }
}

const btree = new BTree(M);
const a1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20];
const a2 = [4,2,7,1,5,3,8];
const arr = a1;

console.log('----------------------------------');
arr.forEach((v) => {
  console.log('ADDING ' + v + ' TO TREE');
  btree.insert(v);
});

console.log(' --- BEFORE REMOVING --- ');
btree.print();

// a.forEach((v) => {
//   console.log('----------------------------------');
//   console.log('REMOVING ' + v + ' FROM TREE');
//   console.log('');
//
//   console.assert( btree.remove(v) );
//   console.log(btree.toString());
// });
