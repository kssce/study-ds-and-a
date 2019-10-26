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

// get value of underflow threshold.
const getT = (dim) => Math.floor(dim / 2);



class BTreeNode {
  constructor (rawDatum = null, left = null, right = null, dim, parent = null) {
    this._data = initByNull(Array(M));
    this._children = initByNull(Array(M + 1));
    this._dataCnt = isNotNull(rawDatum) ? 1 : 0;
    this._dim = dim; // dimension of tree
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

  getDataAt = (idx) => this._data[idx];

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
    return this;
  };

  replaceDatum = (idx, datum) => { this._data[idx] = datum; };

  setIdxFromParent = (idx) => { this._idxFromParent = idx; };

  getIdxFromParent = () => this._idxFromParent;

  add = (datum, left = null, right = null) => {
    if (this.isFull()) return this;

    let i = this._dataCnt;

    while (i > 0 && this.compareTo(this._data[i - 1], datum) > 0) {
      this._data[i] = this._data[i - 1];
      this.setLeftOf(i + 1, this.getLeftOf(i));
      i--;
    }

    this._data[i] = datum;

    if (left) {
      this.setLeftOf(i, left);
      left.setIdxFromParent(i);
    }

    if (right) {
      this.setRightOf(i, right);
      right.setIdxFromParent(i + 1);
    }

    this._dataCnt++;
    return this;
  };

  addDatumOnly = (datum) => {
    if (this.isFull()) return this;

    let i = this._dataCnt;

    while (i > 0 && this.compareTo(this._data[i - 1], datum) > 0) {
      this._data[i] = this._data[i - 1];
      i--;
    }

    this._data[i] = datum;
    this._dataCnt++;
    return this;
  };

  addChildOnlyByIdx = (idx, child) => {
    if (this.isFull() || !child) return this;

    for (let i = this._dataCnt; i >= idx; i--) {
      const currChild = this._children[i];

      if (currChild) currChild.setIdxFromParent(i + 1);

      this._children[i + 1] = currChild;
    }

    child.setIdxFromParent(idx);
    this._children[idx] = child;

    return this;
  };

  _initParentOfChildren = () => {
    this._children.some((child, idx) => {
      if (child === null) return true;

      child.setParent(this).setIdxFromParent(idx);
    });
  };

  _getExistDataAndChildren = () => {
    return {
      data: this._data.filter(datum => datum !== null),//slice(0, this._dataCnt),
      children: this._children.filter(child => child !== null)//slice(0, this._dataCnt + 1)
    };
  };

  _copyWith = (newData, newChildren, len) => {
    for (let i = 0; i < len ; i++) {
      if (i < len - 1) {
        const newDatum = newData[i];
        this._data[i] = newDatum === undefined ? null : newDatum;
      }
      const newChild = newChildren[i];
      this._children[i] = newChild === undefined ? null : newChild;
    }
  };

  mergeToLeftNode = (node) => {
    const { data: rData, children: rChildren } = node._getExistDataAndChildren();
    const { data, children } = this._getExistDataAndChildren();

    const newData = [...data, ...rData];
    const newChildren = [...children, ...rChildren];
    this._dataCnt = newData.length;

    this._copyWith(newData, newChildren, this._dim + 1);
    this._initParentOfChildren();
    return this;
  };

  mergeToRightNode = (node) => {
    const { data: lData, children: lChildren } = node._getExistDataAndChildren();
    const { data, children } = this._getExistDataAndChildren();

    const newData = [...lData, ...data];
    const newChildren = [...lChildren, ...children];
    this._dataCnt = newData.length;

    this._copyWith(newData, newChildren, this._dim + 1);
    this._initParentOfChildren();
    return this;
  };

  // Delete only datum
  deleteDatum = (delIdx) => {
    if ((delIdx + 1) > this._dataCnt) return this;

    for (let i = delIdx; i < this._dataCnt; i++) {
      const rightData = this._data[i + 1];
      this._data[i] = rightData === undefined ? null : rightData;
    }
    this._dataCnt--;

    return this;
  };

  // Delete only child node
  deleteChild = (delIdx) => {
    const len = this._dataCnt + 2;
    for (let i = delIdx; i < len; i++) {
      const rightChild = this._children[i + 1];

      if (isNotExist(rightChild)) {
        this._children[i] = null;

      } else {
        rightChild.setIdxFromParent(i);
        this._children[i] = rightChild;
      }
    }

    return this;
  };

  // If not found, return idx of _children
  find = (datum) => {
    let lowerBound = 0, upperBound = this._dataCnt - 1;

    while (lowerBound <= upperBound) {
      const mid = Math.floor((upperBound + lowerBound) / 2);
      if (this.compareTo(this._data[mid], datum) > 0) upperBound = mid - 1;
      else if (this.compareTo(this._data[mid], datum) < 0) lowerBound = mid + 1;
      else return { idx: mid, isNotFound: false };
    }

    return { childIdx: upperBound + 1, isNotFound: true };
  };

  isUnderflow = () => this._dataCnt < getT(this._dim);

  toString = () => {
    return `parent is ${this._parent ? this._parent.getData().toString() : 'null'}, data is ${this._data.toString()} idx from parent is ${this._idxFromParent}`;
  };
}



class BTree {
  constructor (dim = M) {
    this._dim = dim; // dimension
    this._root = null;
    this._length = 0;
  }

  getSize = () => this._length;

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
    const left = node, right = new BTreeNode(null, null, null, this._dim, pNode);
    left.setParent(pNode);
    const t = getT(this._dim);
    const datumOfChild = left.getDatumAt(t);
    const dividedNode = left.divideBy(t).right; // set with left of splitted node to node. and get splitted right node

    if (!dividedNode) return EMPTY_OBJ;

    const { data, children } = dividedNode;
    right.initBy(data, children, pNode)._initParentOfChildren();

    return { datumOfChild, left, right };
  };

  insert = (rawDatum) => {
    const root = this._root;
    if (!root) {
      this._root = new BTreeNode(rawDatum, null, null, this._dim);
      return;
    }

    const { datumOfChild, left, right }  = this._insertToNode(rawDatum, root);
    if (isNotNull(datumOfChild)) {
      this._root = new BTreeNode(datumOfChild, left, right, this._dim);
      left.setParent(this._root).setIdxFromParent(0);
      right.setParent(this._root).setIdxFromParent(1);
    }
  };

  _insertToNode = (rawDatum, node, pNode) => {
    let foundInfo = node.find(rawDatum);
    if (!foundInfo.isNotFound) return EMPTY_OBJ;

    const cNode = node.getChildAt(foundInfo.childIdx);

    if (node.isLeafNode()) {
      node.add(rawDatum);
      this._length++;

    } else {
      const { datumOfChild, left, right } = this._insertToNode(rawDatum, cNode, node);
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
    const changedRoot = this._deleteFromNode(node, idx);
    
    if (changedRoot) this._root = changedRoot;
  };

  _deleteFromNode = (foundNode, delIdx) => {
    if (foundNode.isLeafNode()) {

      if (!foundNode.isUnderflow() || !foundNode.getParent()) {
        foundNode.deleteDatum(delIdx);
        return null;
      }

      foundNode.deleteDatum(delIdx);
      return this._reBalance(foundNode);

    } else {
      const replacementNode = this._getNodeToReplace(foundNode, delIdx);
      const { node, idx } = replacementNode;
      const datum = node.getDatumAt(idx);

      foundNode.replaceDatum(delIdx, datum);
      return this._deleteFromNode(node, idx);
    }
  };

  _reBalance = (node) => {
    const pNode = node.getParent();
    const idxFromParent = node.getIdxFromParent();
    const rSiblingNode = pNode.getChildAt(idxFromParent + 1);
    const lSiblingNode = pNode.getChildAt(idxFromParent - 1);

    if (lSiblingNode && !lSiblingNode.isUnderflow()) { // borrow from left
      const rightChildIdxInLSibling = lSiblingNode.getDataCnt();
      const rightChildInLSibling = lSiblingNode.getChildAt(rightChildIdxInLSibling);
      lSiblingNode.deleteChild(rightChildIdxInLSibling);

      return this._borrow(
        node,
        idxFromParent - 1,
        this._getMaxCurrNode(lSiblingNode),
        0,
        rightChildInLSibling
      );

    } else if (rSiblingNode && !rSiblingNode.isUnderflow()) { // borrow from right
      const leftChildIdxInRSibling = 0;
      const leftChildInRSibling = rSiblingNode.getChildAt(leftChildIdxInRSibling);
      rSiblingNode.deleteChild(leftChildIdxInRSibling);
      const idxToInsertChildrenFromSibling = node.getDataCnt() + 1; // + 1: before borrow from parent

      return this._borrow(
        node,
        idxFromParent,
        this._getMinCurrNode(rSiblingNode),
        idxToInsertChildrenFromSibling,
        leftChildInRSibling
      );

    } else { // merge with parent and sibling
      return this._merge(node, idxFromParent, lSiblingNode, rSiblingNode);
    }
  };

  _merge = (node, idxFromParent, lSiblingNode, rSiblingNode) => {
    const pNode = node.getParent();
    let baseNode = null, parentDatumIdx = null, datumForPNode = null;

    if (lSiblingNode) {
      parentDatumIdx = idxFromParent - 1;
      datumForPNode = pNode.getDataAt(parentDatumIdx);
      lSiblingNode.addDatumOnly(datumForPNode).mergeToLeftNode(node);
      baseNode = lSiblingNode;

    } else if (rSiblingNode) {
      parentDatumIdx = idxFromParent;
      datumForPNode = pNode.getDataAt(idxFromParent);
      rSiblingNode.addDatumOnly(datumForPNode).mergeToRightNode(node);
      baseNode = rSiblingNode;

    } else {
      return null;
    }
    
    pNode.deleteDatum(parentDatumIdx).deleteChild(idxFromParent);

    if (pNode.isEmpty()) {
      baseNode.setParent(null).setIdxFromParent(null);
      return baseNode;

    } else {
      const ppNode = pNode.getParent();
      if (!ppNode) return null; // Case that is root.

      return pNode.isUnderflow() ? this._reBalance(pNode) : null;
    }
  };

  /**
   * @param node: node with datum to delete
   * @param pIdxToBorrow: the index of the parent pointed to by node and sNodeToBorrow
   * @param sNodeToBorrow: siblingNode
   * @param idxForBNode: data idx in siblingNode
   * @param idxToInsertChildrenFromSibling
   * @param childrenFromSibling
   * @private
   */
  _borrow = (node, pIdxToBorrow, { node: sNodeToBorrow, idx: idxForBNode }, idxToInsertChildrenFromSibling, childrenFromSibling) => {
    if (childrenFromSibling) childrenFromSibling.setParent(node);

    const pNode = node.getParent();
    const datumFromParent = pNode.getDataAt(pIdxToBorrow);
    node.addDatumOnly(datumFromParent).addChildOnlyByIdx(idxToInsertChildrenFromSibling, childrenFromSibling);

    const sDatumToBorrow = sNodeToBorrow.getDatumAt(idxForBNode);
    pNode.replaceDatum(pIdxToBorrow, sDatumToBorrow);
    sNodeToBorrow.deleteDatum(idxForBNode);
    return null;
  };

  /**
   * get max node info from left child or min node info from right child by getIdx
   * @param baseNode
   * @param getChildIdx: for child
   * @param getDataIdx: for own data
   * @param findInCurrNodeOnly: boolean (limit find scope)
   * @returns {{node: *, idx: *}}
   */
  _getChildInfoWith = (baseNode, getChildIdx, getDataIdx, findInCurrNodeOnly) => {
    let node = baseNode;
    let idx = getChildIdx(node);
    let cNode = node.getChildAt(idx);

    while (!findInCurrNodeOnly && cNode) {
      node = cNode;
      idx = getChildIdx(node);
      cNode = node.getChildAt(idx);
    }

    idx = getDataIdx(node);

    return { node, idx };
  };

  _getNodeToReplace = (node, datumIdx) => {
    const lcNode = node.getLeftOf(datumIdx);
    const rcNode = node.getRightOf(datumIdx);

    return (lcNode.getDataCnt() >= rcNode.getDataCnt()) ? this._getMax(lcNode) :  this._getMin(rcNode);
  };

  _getMaxCurrNode = (baseNode) => this._getMax(baseNode, true);

  _getMax = (baseNode, findInCurrNodeOnly = false) => {
    const getBiggestChild = (node) => node.getDataCnt();
    const getBiggestData = (node) => (node.getDataCnt() - 1);
    return this._getChildInfoWith(baseNode, getBiggestChild, getBiggestData, findInCurrNodeOnly);
  };

  _getMinCurrNode = (baseNode) => this._getMin(baseNode, true);

  _getMin = (baseNode, findInCurrNodeOnly = false) => {
    const getSmallestChild = () => 0;
    const getSmallestData = getSmallestChild;
    return this._getChildInfoWith(baseNode, getSmallestChild, getSmallestData, findInCurrNodeOnly);
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
const a1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49, 50];
// const a1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
const a2 = [4,2,7,1,5,3,8];
const arr = a1;



console.log('--------------------------------------------------------------------');
arr.forEach((v) => {
  console.log('Add ' + v + ' to b-tree');
  btree.insert(v);
});

console.log(' --- Before removing --- ');
btree.print();

console.log(' --- After removing --- ');
btree.delete(5);
btree.delete(4);
btree.delete(7);
btree.delete(8);

btree.delete(25);
btree.delete(22);
btree.delete(21);
btree.delete(23);

btree.delete(6);
btree.delete(1);

btree.delete(10);
btree.delete(2);
btree.delete(3);

btree.delete(13);
btree.delete(11);
btree.delete(9);

btree.delete(36);
btree.delete(35);
btree.delete(34);
btree.delete(33);
btree.delete(32);

btree.delete(18);
btree.delete(17);
btree.delete(19);

btree.delete(14);


btree.print();
