"use strict";

var _constant = require("../lib/constant");

var _helper = require("../lib/helper");

var _Queue = _interopRequireDefault(require("../basic/Queue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var M = 4;

var initByNull = function initByNull(list) {
  var len = list.length;

  for (var i = 0; i < len; i++) {
    list[i] = null;
  }

  return list;
}; // get value of underflow threshold.


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
    return _this;
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
    if (_this.isFull()) return _this;
    var i = _this._dataCnt;

    while (i > 0 && _this.compareTo(_this._data[i - 1], datum) > 0) {
      _this._data[i] = _this._data[i - 1];

      _this.setLeftOf(i + 1, _this.getLeftOf(i));

      i--;
    }

    _this._data[i] = datum;

    if (left) {
      _this.setLeftOf(i, left);

      left.setIdxFromParent(i);
    }

    if (right) {
      _this.setRightOf(i, right);

      right.setIdxFromParent(i + 1);
    }

    _this._dataCnt++;
    return _this;
  };

  this.addDatumOnly = function (datum) {
    if (_this.isFull()) return _this;
    var i = _this._dataCnt;

    while (i > 0 && _this.compareTo(_this._data[i - 1], datum) > 0) {
      _this._data[i] = _this._data[i - 1];
      i--;
    }

    _this._data[i] = datum;
    _this._dataCnt++;
    return _this;
  };

  this.addChildOnlyByIdx = function (idx, child) {
    if (_this.isFull() || !child) return _this;

    for (var i = _this._dataCnt; i >= idx; i--) {
      var currChild = _this._children[i];
      if (currChild) currChild.setIdxFromParent(i + 1);
      _this._children[i + 1] = currChild;
    }

    child.setIdxFromParent(idx);
    _this._children[idx] = child;
    return _this;
  };

  this._initParentOfChildren = function () {
    _this._children.some(function (child, idx) {
      if (child === null) return true;
      child.setParent(_this).setIdxFromParent(idx);
    });
  };

  this._getExistDataAndChildren = function () {
    return {
      data: _this._data.filter(function (datum) {
        return datum !== null;
      }),
      //slice(0, this._dataCnt),
      children: _this._children.filter(function (child) {
        return child !== null;
      }) //slice(0, this._dataCnt + 1)

    };
  };

  this._copyWith = function (newData, newChildren, len) {
    for (var i = 0; i < len; i++) {
      if (i < len - 1) {
        var newDatum = newData[i];
        _this._data[i] = newDatum === undefined ? null : newDatum;
      }

      var newChild = newChildren[i];
      _this._children[i] = newChild === undefined ? null : newChild;
    }
  };

  this.mergeToLeftNode = function (node) {
    var _node$_getExistDataAn = node._getExistDataAndChildren(),
        rData = _node$_getExistDataAn.data,
        rChildren = _node$_getExistDataAn.children;

    var _this$_getExistDataAn = _this._getExistDataAndChildren(),
        data = _this$_getExistDataAn.data,
        children = _this$_getExistDataAn.children;

    var newData = [].concat(_toConsumableArray(data), _toConsumableArray(rData));
    var newChildren = [].concat(_toConsumableArray(children), _toConsumableArray(rChildren));
    _this._dataCnt = newData.length;

    _this._copyWith(newData, newChildren, _this._dim + 1);

    _this._initParentOfChildren();

    return _this;
  };

  this.mergeToRightNode = function (node) {
    var _node$_getExistDataAn2 = node._getExistDataAndChildren(),
        lData = _node$_getExistDataAn2.data,
        lChildren = _node$_getExistDataAn2.children;

    var _this$_getExistDataAn2 = _this._getExistDataAndChildren(),
        data = _this$_getExistDataAn2.data,
        children = _this$_getExistDataAn2.children;

    var newData = [].concat(_toConsumableArray(lData), _toConsumableArray(data));
    var newChildren = [].concat(_toConsumableArray(lChildren), _toConsumableArray(children));
    _this._dataCnt = newData.length;

    _this._copyWith(newData, newChildren, _this._dim + 1);

    _this._initParentOfChildren();

    return _this;
  };

  this.deleteDatum = function (delIdx) {
    if (delIdx + 1 > _this._dataCnt) return _this;

    for (var i = delIdx; i < _this._dataCnt; i++) {
      var rightData = _this._data[i + 1];
      _this._data[i] = rightData === undefined ? null : rightData;
    }

    _this._dataCnt--;
    return _this;
  };

  this.deleteChild = function (delIdx) {
    var len = _this._dataCnt + 2;

    for (var i = delIdx; i < len; i++) {
      var rightChild = _this._children[i + 1];

      if ((0, _helper.isNotExist)(rightChild)) {
        _this._children[i] = null;
      } else {
        rightChild.setIdxFromParent(i);
        _this._children[i] = rightChild;
      }
    }

    return _this;
  };

  this.find = function (datum) {
    var lowerBound = 0,
        upperBound = _this._dataCnt - 1;

    while (lowerBound <= upperBound) {
      var mid = Math.floor((upperBound + lowerBound) / 2);
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
  this._dim = dim; // dimension of tree

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

  this.getSize = function () {
    return _this2._length;
  };

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
        right = new BTreeNode(null, null, null, _this2._dim, pNode);
    left.setParent(pNode);
    var t = getT(_this2._dim);
    var datumOfChild = left.getDatumAt(t);
    var dividedNode = left.divideBy(t).right; // set with left of splitted node to node. and get splitted right node

    if (!dividedNode) return _constant.EMPTY_OBJ;
    var data = dividedNode.data,
        children = dividedNode.children;

    right.initBy(data, children, pNode)._initParentOfChildren();

    return {
      datumOfChild: datumOfChild,
      left: left,
      right: right
    };
  };

  this.insert = function (rawDatum) {
    var root = _this2._root;

    if (!root) {
      _this2._root = new BTreeNode(rawDatum, null, null, _this2._dim);
      return;
    }

    var _this2$_insertToNode = _this2._insertToNode(rawDatum, root),
        datumOfChild = _this2$_insertToNode.datumOfChild,
        left = _this2$_insertToNode.left,
        right = _this2$_insertToNode.right;

    if ((0, _helper.isNotNull)(datumOfChild)) {
      _this2._root = new BTreeNode(datumOfChild, left, right, _this2._dim);
      left.setParent(_this2._root).setIdxFromParent(0);
      right.setParent(_this2._root).setIdxFromParent(1);
    }
  };

  this._insertToNode = function (rawDatum, node, pNode) {
    var foundInfo = node.find(rawDatum);
    if (!foundInfo.isNotFound) return _constant.EMPTY_OBJ;
    var cNode = node.getChildAt(foundInfo.childIdx);

    if (node.isLeafNode()) {
      node.add(rawDatum);
      _this2._length++;
    } else {
      var _this2$_insertToNode2 = _this2._insertToNode(rawDatum, cNode, node),
          datumOfChild = _this2$_insertToNode2.datumOfChild,
          left = _this2$_insertToNode2.left,
          right = _this2$_insertToNode2.right;

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

    var changedRoot = _this2._deleteFromNode(node, idx);

    if (changedRoot) _this2._root = changedRoot;
  };

  this._deleteFromNode = function (foundNode, delIdx) {
    if (foundNode.isLeafNode()) {
      if (!foundNode.isUnderflow() || !foundNode.getParent()) {
        foundNode.deleteDatum(delIdx);
        return null;
      }

      foundNode.deleteDatum(delIdx);
      return _this2._reBalance(foundNode);
    } else {
      var replacementNode = _this2._getNodeToReplace(foundNode, delIdx);

      var node = replacementNode.node,
          idx = replacementNode.idx;
      var datum = node.getDatumAt(idx);
      foundNode.replaceDatum(delIdx, datum);
      return _this2._deleteFromNode(node, idx);
    }
  };

  this._reBalance = function (node) {
    var pNode = node.getParent();
    var idxFromParent = node.getIdxFromParent();
    var rSiblingNode = pNode.getChildAt(idxFromParent + 1);
    var lSiblingNode = pNode.getChildAt(idxFromParent - 1);

    if (lSiblingNode && !lSiblingNode.isUnderflow()) {
      // borrow from left
      var rightChildIdxInLSibling = lSiblingNode.getDataCnt();
      var rightChildInLSibling = lSiblingNode.getChildAt(rightChildIdxInLSibling);
      lSiblingNode.deleteChild(rightChildIdxInLSibling);
      return _this2._borrow(node, idxFromParent - 1, _this2._getMaxCurrNode(lSiblingNode), 0, rightChildInLSibling);
    } else if (rSiblingNode && !rSiblingNode.isUnderflow()) {
      // borrow from right
      var leftChildIdxInRSibling = 0;
      var leftChildInRSibling = rSiblingNode.getChildAt(leftChildIdxInRSibling);
      rSiblingNode.deleteChild(leftChildIdxInRSibling);
      var idxToInsertChildrenFromSibling = node.getDataCnt() + 1; // + 1: before borrow from parent

      return _this2._borrow(node, idxFromParent, _this2._getMinCurrNode(rSiblingNode), idxToInsertChildrenFromSibling, leftChildInRSibling);
    } else {
      // merge with parent and sibling
      return _this2._merge(node, idxFromParent, lSiblingNode, rSiblingNode);
    }
  };

  this._merge = function (node, idxFromParent, lSiblingNode, rSiblingNode) {
    var pNode = node.getParent();
    var baseNode = null,
        parentDatumIdx = null,
        datumForPNode = null;

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
      var ppNode = pNode.getParent();
      if (!ppNode) return null; // Case that is root.

      return pNode.isUnderflow() ? _this2._reBalance(pNode) : null;
    }
  };

  this._borrow = function (node, pIdxToBorrow, _ref, idxToInsertChildrenFromSibling, childrenFromSibling) {
    var sNodeToBorrow = _ref.node,
        idxForBNode = _ref.idx;
    if (childrenFromSibling) childrenFromSibling.setParent(node);
    var pNode = node.getParent();
    var datumFromParent = pNode.getDataAt(pIdxToBorrow);
    node.addDatumOnly(datumFromParent).addChildOnlyByIdx(idxToInsertChildrenFromSibling, childrenFromSibling);
    var sDatumToBorrow = sNodeToBorrow.getDatumAt(idxForBNode);
    pNode.replaceDatum(pIdxToBorrow, sDatumToBorrow);
    sNodeToBorrow.deleteDatum(idxForBNode);
    return null;
  };

  this._getChildInfoWith = function (baseNode, getChildIdx, getDataIdx, findInCurrNodeOnly) {
    var node = baseNode;
    var idx = getChildIdx(node);
    var cNode = node.getChildAt(idx);

    while (!findInCurrNodeOnly && cNode) {
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

  this._getNodeToReplace = function (node, datumIdx) {
    var lcNode = node.getLeftOf(datumIdx);
    var rcNode = node.getRightOf(datumIdx);
    return lcNode.getDataCnt() >= rcNode.getDataCnt() ? _this2._getMax(lcNode) : _this2._getMin(rcNode);
  };

  this._getMaxCurrNode = function (baseNode) {
    return _this2._getMax(baseNode, true);
  };

  this._getMax = function (baseNode) {
    var findInCurrNodeOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var getBiggestChild = function getBiggestChild(node) {
      return node.getDataCnt();
    };

    var getBiggestData = function getBiggestData(node) {
      return node.getDataCnt() - 1;
    };

    return _this2._getChildInfoWith(baseNode, getBiggestChild, getBiggestData, findInCurrNodeOnly);
  };

  this._getMinCurrNode = function (baseNode) {
    return _this2._getMin(baseNode, true);
  };

  this._getMin = function (baseNode) {
    var findInCurrNodeOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var getSmallestChild = function getSmallestChild() {
      return 0;
    };

    var getSmallestData = getSmallestChild;
    return _this2._getChildInfoWith(baseNode, getSmallestChild, getSmallestData, findInCurrNodeOnly);
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

  this._dim = dim; // dimension

  this._root = null;
  this._length = 0;
};

var btree = new BTree(M);
var a1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]; // const a1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];

var a2 = [4, 2, 7, 1, 5, 3, 8];
var arr = a1;
console.log('--------------------------------------------------------------------');
arr.forEach(function (v) {
  console.log('Add ' + v + ' to b-tree');
  btree.insert(v);
});
console.log(' --- Before removing --- ');
btree.print();
console.log(' --- After removing --- ');
btree["delete"](5);
btree["delete"](4);
btree["delete"](7);
btree["delete"](8);
btree["delete"](25);
btree["delete"](22);
btree["delete"](21);
btree["delete"](23);
btree["delete"](6);
btree["delete"](1);
btree["delete"](10);
btree["delete"](2);
btree["delete"](3);
btree["delete"](13);
btree["delete"](11);
btree["delete"](9);
btree["delete"](36);
btree["delete"](35);
btree["delete"](34);
btree["delete"](33);
btree["delete"](32);
btree["delete"](18);
btree["delete"](17);
btree["delete"](19);
btree["delete"](14);
btree.print();