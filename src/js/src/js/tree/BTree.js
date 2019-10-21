import { EMPTY, EMPTY_OBJ } from '../lib/constant';
import { isNotExist, isNotNull } from '../lib/helper';
import Queue from '../basic/Queue';



const M = 4;

const initByNull = (list) => {
  const len = list.length;
  for (let i = 0 ; i < len ; i ++) {
    list[i] = null;
  }
  return list;
};

const getT = (dim) => Math.floor(dim / 2);



class BTreeNode {
  constructor (rawDatum = null, left = null, right = null, dim, parent = null) {
    this._data = initByNull(Array(M));
    this._children = initByNull(Array(M + 1));
    this._dataCnt = isNotNull(rawDatum) ? 1 : 0;
    this._dim = dim; // dimention of tree
    this._data[0] = rawDatum;
    this._children[0] = left;
    this._children[1] = right;
    this._parent = parent;
    this._idxFromParent = EMPTY;
    this.getMemOf = (datum) => ({ key: datum, val: datum });
    this.compareTo = (datumA, datumB) => (this.getMemOf(datumA).key - this.getMemOf(datumB).key);
  }

  setParent = (parent) => {
    this._parent = parent;
    return this;
  };

  getParent = () => this._parent;

  isLeafNode = () => !this._children[0];

  setGetMemOf = (getMemOfMethod) => { this.getMemOf = getMemOfMethod; };

  isFull = () => (this._dataCnt >= this._dim);

  isEmpty = () => (!this._dataCnt);

  getDatumAt = (idx) => this._data[idx];

  getData = () => this._data;

  setData = (data) => { this._data = data; };

  getDataCnt = () => this._dataCnt;

  getChildAt = (idx) => this._children[idx];

  getChildren = () => this._children;

  setChildren = (children) => { this._children = children; };

  getLeftOf = (idx) => this._children[idx];

  setLeftOf = (idx, node) => { this._children[idx] = node; };

  getRightOf = (idx) => this._children[idx + 1];

  setRightOf = (idx, node) => { this._children[idx + 1] = node; };

  setChildAt = (idx, child) => {
    if (isNotExist(this._children[idx])) this._dataCnt++;

    this._children[idx] = child;
  };

  setDatumAt = (idx, datum) => {
    if (isNotExist(this._data[idx])) this._dataCnt++;

    this._data[idx] = datum;
  };

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
      if (this._children[i]) {
        this._children[i].setParent(this).setIdxFromParent(i);
      }
    }
    this._children[len] = children[len] || null;
  };

  replaceDatum = (idx, datum) => { this._data[idx] = datum; };

  setIdxFromParent = (idx) => { this._idxFromParent = idx; };

  getIdxFromParent = (idx) => this._idxFromParent = idx;

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
    if (left) left.setIdxFromParent(i);

    this.setRightOf(i, right);
    if (right) right.setIdxFromParent(i + 1);

    this._dataCnt++;
    return true;
  };

  merge = (pNode, delIdx, lChildNode, rChildNode) => {
    if (lChildNode.getDataCnt() + rChildNode.getDataCnt > this._dim) return false;

    let lDataLen = lChildNode.getDataCnt(), rDataLen = rChildNode.getDataCnt();

    for (let i = 0; i < rDataLen; i++) {
      lChildNode.setChildAt(lDataLen + i, rChildNode.getChildAt(i));
      lChildNode.setDatumAt(lDataLen + i, rChildNode.getDatumAt(i));
    }
    lChildNode.setChildAt(lDataLen + rDataLen, rChildNode.getChildAt(rDataLen));

    pNode.setRightOf(delIdx, null);

    return true;
  };

  // Delete only if it is a child node.
  delete = (delIdx) => {
    let i = delIdx + 1;
    if (i > this._dataCnt) return false;

    this._data[delIdx] = null;

    this._dataCnt--;
    return true;
  };

  // delete = (delIdx) => {
  //   let i = delIdx + 1;
  //   if (i > this._dataCnt) return false;
  //
  //   const isMerged = this.merge(this, delIdx, this.getLeftOf(delIdx), this.getRightOf(delIdx));
  //   if (!isMerged) return false;
  //
  //   this._data[delIdx] = null;
  //
  //   for (; i < this._dataCnt; i < this._dataCnt) {
  //     this._data[i - 1] = this._data[i];
  //     this.setLeftOf(i - 1, this.getLeftOf(i));
  //   }
  //
  //   if (i > delIdx + 1) {
  //     this.setLeftOf(i - 1, this.getLeftOf(i));
  //     this.setRightOf(i - 1, null);
  //   }
  //   this._dataCnt--;
  //   return true;
  // };

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

  toString = () => {
    return `parent is ${this._parent ? this._parent.getData().toString() : 'null'}, data is ${this._data.toString()} idx from parent is ${this._idxFromParent}`;
  };
}



class BTree {
  constructor (dim = M) {
    this.dim = dim; // dimention
    this._root = null;
    this.length = 0;
  }

  findNode = (datum) => {
    let pNode = null;
    let cIdx = EMPTY;
    let node = this._root;
    let foundRst = node.find(datum);

    while (node && foundRst.isNotFound) {
      pNode = node;
      cIdx = foundRst.childIdx;
      node = node.getChildAt(foundRst.childIdx);
      if (node) foundRst = node.find(datum);
    }

    return node ? { node, idx: foundRst.idx, pNode, cIdx } : null;
  };

  _split = (node, pNode) => {
    const left = node, right = new BTreeNode(null, null, null, this.dim, pNode);
    left.setParent(pNode);
    const t = getT(this.dim);
    const datumOfChild = left.getDatumAt(t);
    const dividedNode = left.divideBy(t).right; // set with left of splitted node to node. and get splitted right node

    if (!dividedNode) return EMPTY_OBJ;

    const { data, children } = dividedNode;
    right.initBy(data, children);

    return { datumOfChild, left, right };
  };

  insert = (rawDatum) => {
    const root = this._root;
    if (!root) {
      this._root = new BTreeNode(rawDatum, null, null, this.dim);
      return;
    }

    const { datumOfChild, left, right }  = this.insertToNode(rawDatum, root);
    if (isNotNull(datumOfChild)) {
      this._root = new BTreeNode(datumOfChild, left, right, this.dim);
      left.setParent(this._root).setIdxFromParent(0);
      right.setParent(this._root).setIdxFromParent(1);
    }
  };

  insertToNode = (rawDatum, node, pNode) => {
    let foundInfo = node.find(rawDatum);
    if (!foundInfo.isNotFound) return EMPTY_OBJ;

    const cNode = node.getChildAt(foundInfo.childIdx);

    if (node.isLeafNode()) {
      node.add(rawDatum);
      this.length++;

    } else {
      const { datumOfChild, left, right } = this.insertToNode(rawDatum, cNode, node);
      if (isNotNull(datumOfChild)) {
        node.add(datumOfChild, left, right);
      }
    }

    return node.isFull() ? this._split(node, pNode) : EMPTY_OBJ;
  };

  delete = (rawDatum) => {
    if (!this._root) return;

    const foundNode = this.findNode(rawDatum);
    if (!foundNode) return;

    const { node, idx, pNode, cIdx } = foundNode;
    const changedNode = this.deleteFromNode(node, idx);
    
    if (changedNode) {
      if (pNode) {
        pNode.setChildAt(cIdx, changedNode);
      } else {
        this._root = changedNode;
      }
    }

    // todo 중간 노드 삭제시 좌측이나 우측의 리프에서 데이터 가져와서 삭제하는 것 성공
    // todo 문제는 자식을 병합해서 루트나 부모노드까지 바꾸기는 성공했으나
    // todo 자식의 자식(CC)은 병합되지 않았으며, 병합할 경우 CC는 overflow 발생...

    console.log('>> P >   ', pNode && pNode._data, pNode && pNode.getChildren().map(c=>c&&c._data));
    console.log('>> R >   ', changedNode && changedNode._data, changedNode && changedNode.getChildren().map(c=>c&&c._data));
  };

  deleteFromNode = (foundNode, delIdx) => {
    if (foundNode.isLeafNode()) {
      foundNode.delete(delIdx);
      // or re-balancing
      return foundNode.getDataCnt() >= getT(this.dim) ? null : foundNode ;

    } else {
      const replacementNode = this.getReplacementNode(foundNode, delIdx);
      if (replacementNode) {
        const { node, idx } = replacementNode;
        const datum = node.getDatumAt(idx);

        foundNode.replaceDatum(delIdx, datum);
        this.deleteFromNode(node, idx);

      } else { // merge
        foundNode.delete(delIdx); // and merge children
        if (foundNode.isEmpty()) return foundNode.getChildAt(0);
      }
    }

    return null;
  };

  /**
   * get max node info from left child or min node info from right child by getIdx
   * @param baseNode
   * @param getIdx
   * @returns {{node: *, idx: *}}
   */
  getChildInfoWith = (baseNode, getIdx) => {
    let node = baseNode;
    let idx = getIdx(node);
    let cNode = node.getChildAt(idx);

    while (cNode) {
      node = cNode;
      idx = getIdx(node);
      cNode = node.getChildAt(idx);
    }

    return { node, idx };
  };

  getReplacementNode = (node, datumIdx) => {
    const lChildNode = node.getLeftOf(datumIdx);
    const rChildNode = node.getRightOf(datumIdx);
    const t = getT(this.dim);

    if (lChildNode && lChildNode.getDataCnt() > t) { // get max from left child
      return this.getChildInfoWith(lChildNode, (node) => node.getDataCnt());
    }

    if (rChildNode && rChildNode.getDataCnt() > t) { // get min from right child
      return this.getChildInfoWith(rChildNode, () => 0);
    }

    return null;
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
// const a1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20];
const a1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
const a2 = [4,2,7,1,5,3,8];
const arr = a1;

console.log('----------------------------------');
arr.forEach((v) => {
  console.log('ADDING ' + v + ' TO TREE');
  btree.insert(v);
});

console.log(' --- BEFORE REMOVING --- ');
btree.print();

console.log('==============================');
btree.delete(9);


// a.forEach((v) => {
//   console.log('----------------------------------');
//   console.log('REMOVING ' + v + ' FROM TREE');
//   console.log('');
//
//   console.assert( btree.remove(v) );
//   console.log(btree.toString());
// });
