"use strict";

var _constant = require("../lib/constant");

var _helper = require("../lib/helper");

var _Queue = _interopRequireDefault(require("../basic/Queue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var M = 4;

var initByNull = function initByNull(list) {
  var len = list.length;

  for (var i = 0; i < len; i++) {
    list[i] = null;
  }

  return list;
};

var getT = function getT(dim) {
  return Math.floor(dim / 2);
};

var BTreeNode = function BTreeNode() {
  var _this = this;

  var rawDatum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var _right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var dim = arguments.length > 3 ? arguments[3] : undefined;

  var _parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  _classCallCheck(this, BTreeNode);

  this.setParent = function (parent) {
    _this._parent = parent;
    return _this;
  };

  this.getParent = function () {
    return _this._parent;
  };

  this.isLeafNode = function () {
    return !_this._children[0];
  };

  this.setGetMemOf = function (getMemOfMethod) {
    _this.getMemOf = getMemOfMethod;
  };

  this.isFull = function () {
    return _this._dataCnt >= _this._dim;
  };

  this.isEmpty = function () {
    return !_this._dataCnt;
  };

  this.getDatumAt = function (idx) {
    return _this._data[idx];
  };

  this.getData = function () {
    return _this._data;
  };

  this.setData = function (data) {
    _this._data = data;
  };

  this.getDataCnt = function () {
    return _this._dataCnt;
  };

  this.getChildAt = function (idx) {
    return _this._children[idx];
  };

  this.getChildren = function () {
    return _this._children;
  };

  this.setChildren = function (children) {
    _this._children = children;
  };

  this.getLeftOf = function (idx) {
    return _this._children[idx];
  };

  this.setLeftOf = function (idx, node) {
    _this._children[idx] = node;
  };

  this.getRightOf = function (idx) {
    return _this._children[idx + 1];
  };

  this.setRightOf = function (idx, node) {
    _this._children[idx + 1] = node;
  };

  this.getDataAt = function (idx) {
    return _this._data[idx];
  };

  this.setChildAt = function (idx, child) {
    if ((0, _helper.isNotExist)(_this._children[idx])) _this._dataCnt++;
    _this._children[idx] = child;
  };

  this.setDatumAt = function (idx, datum) {
    if ((0, _helper.isNotExist)(_this._data[idx])) _this._dataCnt++;
    _this._data[idx] = datum;
  };

  this.divideBy = function (pivotIdx) {
    if ((0, _helper.isNotNull)(_this._data[pivotIdx])) {
      var data = [],
          children = [];
      var childrenCnt = _this._dataCnt + 1;

      for (var i = pivotIdx + 1; i < childrenCnt; i++) {
        children.push(_this._children[i]);
        _this._children[i] = null;

        if (i < _this._dataCnt) {
          data.push(_this._data[i]);
          _this._data[i] = null;
          _this._dataCnt--;
        }
      } // remove center datum


      _this._data[pivotIdx] = null;
      _this._dataCnt--;
      return {
        right: {
          data: data,
          children: children
        }
      };
    }

    return _constant.EMPTY_OBJ;
  };

  this.initBy = function (data, children) {
    var len = data.length;

    for (var i = 0; i < len; i++) {
      _this._data[i] = data[i];
      _this._dataCnt++;
      _this._children[i] = children[i];

      if (_this._children[i]) {
        _this._children[i].setParent(_this).setIdxFromParent(i);
      }
    }

    _this._children[len] = children[len] || null;
  };

  this.replaceDatum = function (idx, datum) {
    _this._data[idx] = datum;
  };

  this.setIdxFromParent = function (idx) {
    _this._idxFromParent = idx;
  };

  this.getIdxFromParent = function () {
    return _this._idxFromParent;
  };

  this.add = function (datum) {
    var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (_this.isFull()) return false;
    var i = _this._dataCnt;

    while (i > 0 && _this.compareTo(_this._data[i - 1], datum) > 0) {
      _this._data[i] = _this._data[i - 1];

      _this.setLeftOf(i + 1, _this.getLeftOf(i));

      i--;
    }

    _this._data[i] = datum;

    _this.setLeftOf(i, left);

    if (left) left.setIdxFromParent(i);

    _this.setRightOf(i, right);

    if (right) right.setIdxFromParent(i + 1);
    _this._dataCnt++;
    return true;
  };

  this.merge = function (pNode, delIdx, lChildNode, rChildNode) {
    if (lChildNode.getDataCnt() + rChildNode.getDataCnt > _this._dim) return false;
    var lDataLen = lChildNode.getDataCnt(),
        rDataLen = rChildNode.getDataCnt();

    for (var i = 0; i < rDataLen; i++) {
      lChildNode.setChildAt(lDataLen + i, rChildNode.getChildAt(i));
      lChildNode.setDatumAt(lDataLen + i, rChildNode.getDatumAt(i));
    }

    lChildNode.setChildAt(lDataLen + rDataLen, rChildNode.getChildAt(rDataLen));
    pNode.setRightOf(delIdx, null);
    return true;
  };

  this["delete"] = function (delIdx) {
    var i = delIdx + 1;
    if (i > _this._dataCnt) return false;
    _this._data[delIdx] = null;

    for (var _i = delIdx; _i < _this._dataCnt; _i++) {
      _this._data[_i] = _this._data[_i + 1];
    }

    _this._dataCnt--;
    return true;
  };

  this.find = function (datum) {
    // If not found, return idx of _children
    var lowerBound = 0,
        upperBound = _this._dataCnt - 1;

    while (lowerBound <= upperBound) {
      var mid = Math.floor((upperBound + lowerBound) / 2); // Not allowed in other languages

      if (_this.compareTo(_this._data[mid], datum) > 0) upperBound = mid - 1;else if (_this.compareTo(_this._data[mid], datum) < 0) lowerBound = mid + 1;else return {
        idx: mid,
        isNotFound: false
      };
    }

    return {
      childIdx: upperBound + 1,
      isNotFound: true
    };
  };

  this.isUnderflow = function () {
    return _this._dataCnt < getT(_this._dim);
  };

  this.toString = function () {
    return "parent is ".concat(_this._parent ? _this._parent.getData().toString() : 'null', ", data is ").concat(_this._data.toString(), " idx from parent is ").concat(_this._idxFromParent);
  };

  this._data = initByNull(Array(M));
  this._children = initByNull(Array(M + 1));
  this._dataCnt = (0, _helper.isNotNull)(rawDatum) ? 1 : 0;
  this._dim = dim; // dimention of tree

  this._data[0] = rawDatum;
  this._children[0] = _left;
  this._children[1] = _right;
  this._parent = _parent;
  this._idxFromParent = _constant.EMPTY;

  this.getMemOf = function (datum) {
    return {
      key: datum,
      val: datum
    };
  };

  this.compareTo = function (datumA, datumB) {
    return _this.getMemOf(datumA).key - _this.getMemOf(datumB).key;
  };
};

var BTree = function BTree() {
  var _this2 = this;

  var dim = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : M;

  _classCallCheck(this, BTree);

  this.findNode = function (datum) {
    var pNode = null;
    var cIdx = _constant.EMPTY;
    var node = _this2._root;
    var foundRst = node.find(datum);

    while (node && foundRst.isNotFound) {
      pNode = node;
      cIdx = foundRst.childIdx;
      node = node.getChildAt(foundRst.childIdx);
      if (node) foundRst = node.find(datum);
    }

    return node ? {
      node: node,
      idx: foundRst.idx,
      pNode: pNode,
      cIdx: cIdx
    } : null;
  };

  this._split = function (node, pNode) {
    var left = node,
        right = new BTreeNode(null, null, null, _this2.dim, pNode);
    left.setParent(pNode);
    var t = getT(_this2.dim);
    var datumOfChild = left.getDatumAt(t);
    var dividedNode = left.divideBy(t).right; // set with left of splitted node to node. and get splitted right node

    if (!dividedNode) return _constant.EMPTY_OBJ;
    var data = dividedNode.data,
        children = dividedNode.children;
    right.initBy(data, children);
    return {
      datumOfChild: datumOfChild,
      left: left,
      right: right
    };
  };

  this.insert = function (rawDatum) {
    var root = _this2._root;

    if (!root) {
      _this2._root = new BTreeNode(rawDatum, null, null, _this2.dim);
      return;
    }

    var _this2$insertToNode = _this2.insertToNode(rawDatum, root),
        datumOfChild = _this2$insertToNode.datumOfChild,
        left = _this2$insertToNode.left,
        right = _this2$insertToNode.right;

    if ((0, _helper.isNotNull)(datumOfChild)) {
      _this2._root = new BTreeNode(datumOfChild, left, right, _this2.dim);
      left.setParent(_this2._root).setIdxFromParent(0);
      right.setParent(_this2._root).setIdxFromParent(1);
    }
  };

  this.insertToNode = function (rawDatum, node, pNode) {
    var foundInfo = node.find(rawDatum);
    if (!foundInfo.isNotFound) return _constant.EMPTY_OBJ;
    var cNode = node.getChildAt(foundInfo.childIdx);

    if (node.isLeafNode()) {
      node.add(rawDatum);
      _this2.length++;
    } else {
      var _this2$insertToNode2 = _this2.insertToNode(rawDatum, cNode, node),
          datumOfChild = _this2$insertToNode2.datumOfChild,
          left = _this2$insertToNode2.left,
          right = _this2$insertToNode2.right;

      if ((0, _helper.isNotNull)(datumOfChild)) {
        node.add(datumOfChild, left, right);
      }
    }

    return node.isFull() ? _this2._split(node, pNode) : _constant.EMPTY_OBJ;
  };

  this["delete"] = function (rawDatum) {
    if (!_this2._root) return;

    var foundNode = _this2.findNode(rawDatum);

    if (!foundNode) return;
    var node = foundNode.node,
        idx = foundNode.idx,
        pNode = foundNode.pNode,
        cIdx = foundNode.cIdx;

    var changedNode = _this2.deleteFromNode(node, idx);

    if (changedNode) {
      if (pNode) {
        pNode.setChildAt(cIdx, changedNode);
      } else {
        _this2._root = changedNode;
      }
    } // console.log('>> P >   ', pNode && pNode._data, pNode && pNode.getChildren().map(c=>c&&c._data));
    // console.log('>> R >   ', changedNode && changedNode._data, changedNode && changedNode.getChildren().map(c=>c&&c._data));

  };

  this.deleteFromNode = function (foundNode, delIdx) {
    if (foundNode.isLeafNode()) {
      if (!foundNode.isUnderflow() || !foundNode.getParent()) {
        foundNode["delete"](delIdx);
        return null;
      }

      foundNode["delete"](delIdx);
      return _this2.reBalance(foundNode);
    } else {
      var replacementNode = _this2.getReplacementNode(foundNode, delIdx);

      var node = replacementNode.node,
          idx = replacementNode.idx;
      var datum = node.getDatumAt(idx);
      console.log('> Datum to delete.', node._data, node._dataCnt, idx, node._children, datum);
      foundNode.replaceDatum(delIdx, datum);
      return _this2.deleteFromNode(node, idx);
    }
  };

  this.reBalance = function (node) {
    // todo if count of data of sibling >= T Then borrow
    var pNode = node.getParent();
    var idxFromParent = node.getIdxFromParent();
    var rSiblingNode = pNode.getChildAt(idxFromParent + 1);
    var lSiblingNode = pNode.getChildAt(idxFromParent - 1);

    if (lSiblingNode && !lSiblingNode.isUnderflow()) {
      // borrow from left
      return _this2._borrow(node, idxFromParent - 1, _this2._getMax(lSiblingNode));
    } else if (rSiblingNode && !rSiblingNode.isUnderflow()) {
      // borrow from right
      return _this2._borrow(node, idxFromParent, _this2._getMin(rSiblingNode));
    } else {
      // todo else merge
      // todo recursive merge
      console.log('merge.');
    }
  };

  this._merge = function () {};

  this._borrow = function (node, pIdxToBorrow, _ref) {
    var sNodeToBorrow = _ref.node,
        idxForBNode = _ref.idx;
    var pNode = node.getParent();
    var datumFromParent = pNode.getDataAt(pIdxToBorrow);
    node.add(datumFromParent);
    var sDatumToBorrow = sNodeToBorrow.getDatumAt(idxForBNode);
    pNode.replaceDatum(pIdxToBorrow, sDatumToBorrow);
    sNodeToBorrow["delete"](idxForBNode);
    return null;
  };

  this.getChildInfoWith = function (baseNode, getChildIdx, getDataIdx) {
    var node = baseNode;
    var idx = getChildIdx(node);
    var cNode = node.getChildAt(idx);

    while (cNode) {
      node = cNode;
      idx = getChildIdx(node);
      cNode = node.getChildAt(idx);
    }

    idx = getDataIdx(node);
    return {
      node: node,
      idx: idx
    };
  };

  this.getReplacementNode = function (node, datumIdx) {
    var lChildNode = node.getLeftOf(datumIdx);
    var rChildNode = node.getRightOf(datumIdx);

    if (lChildNode.getDataCnt() >= rChildNode.getDataCnt()) {
      return _this2._getMax(lChildNode);
    } else {
      return _this2._getMin(rChildNode);
    }
  };

  this._getMax = function (baseNode) {
    var getBiggestChild = function getBiggestChild(node) {
      return node.getDataCnt();
    };

    var getBiggestData = function getBiggestData(node) {
      return node.getDataCnt() - 1;
    };

    return _this2.getChildInfoWith(baseNode, getBiggestChild, getBiggestData);
  };

  this._getMin = function (baseNode) {
    var getSmallestChild = function getSmallestChild() {
      return 0;
    };

    var getSmallestData = getSmallestChild;
    return _this2.getChildInfoWith(baseNode, getSmallestChild, getSmallestData);
  };

  this.print = function () {
    var q = new _Queue["default"]();
    var curr = _this2._root;

    while (curr) {
      if (!curr.isLeafNode()) {
        console.log('\ncurrNode ', curr.toString());
        console.log('children nodes ', curr.getChildren().map(function (node) {
          return node && node.toString();
        }));
        curr.getChildren().forEach(function (child) {
          (0, _helper.isNotNull)(child) && q.enqueue(child);
        });
      }

      curr = q.dequeue();
    }
  };

  this.dim = dim; // dimention

  this._root = null;
  this.length = 0;
};

var btree = new BTree(M); // const a1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43];

var a1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
var a2 = [4, 2, 7, 1, 5, 3, 8];
var arr = a1;
console.log('----------------------------------');
arr.forEach(function (v) {
  console.log('ADDING ' + v + ' TO TREE');
  btree.insert(v);
});
console.log(' --- BEFORE REMOVING --- ');
btree.print();
console.log('==============================');
btree["delete"](1);
btree["delete"](2);
btree["delete"](16);
btree["delete"](17);
btree.print(); // a.forEach((v) => {
//   console.log('----------------------------------');
//   console.log('REMOVING ' + v + ' FROM TREE');
//   console.log('');
//
//   console.assert( btree.remove(v) );
//   console.log(btree.toString());
// });