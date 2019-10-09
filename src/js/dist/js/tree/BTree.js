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

var BTreeNode = function BTreeNode() {
  var _this = this;

  var rawDatum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var _right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var dim = arguments.length > 3 ? arguments[3] : undefined;

  _classCallCheck(this, BTreeNode);

  this.isLeafNode = function () {
    return !_this._children[0];
  };

  this.setGetMemOf = function (getMemOfMethod) {
    _this.getMemOf = getMemOfMethod;
  };

  this.isFull = function () {
    return _this._dataCnt >= _this._dim;
  };

  this.getDatumAt = function (idx) {
    return _this._data[idx];
  };

  this.getChildAt = function (idx) {
    return _this._children[idx];
  };

  this.getChildren = function () {
    return _this._children;
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
    }

    _this._children[len] = children[len] || null;
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

    _this.setRightOf(i, right);

    _this._dataCnt++;
    return true;
  };

  this.del = function (delIdx) {
    var i = delIdx + 1;
    if (i > _this._dataCnt) return false;

    for (; i < _this._dataCnt; i < _this._dataCnt) {
      _this._data[i - 1] = _this._data[i];

      _this.setLeftOf(i - 1, _this.getLeftOf(i));
    }

    _this.setLeftOf(i - 1, _this.getLeftOf(i));

    _this.setRightOf(i - 1, null);

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

  this.toString = function () {
    return _this._data;
  };

  this._data = initByNull(Array(M));
  this._children = initByNull(Array(M + 1));
  this._dataCnt = (0, _helper.isNotNull)(rawDatum) ? 1 : 0;
  this._dim = dim; // dimention of tree

  this._data[0] = rawDatum;
  this._children[0] = _left;
  this._children[1] = _right;

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

  this.find = function (datum) {
    var node = _this2._root;
    var foundRst = node.find(datum);

    while (node && foundRst.isNotFound) {
      node = node.getChildAt(foundRst.idx);
      foundRst = node.find(datum);
    }

    return node ? node[foundRst.idx] : null;
  };

  this._split = function (node) {
    var left = node,
        right = new BTreeNode(null, null, null, _this2.dim);
    var t = Math.floor(_this2.dim / 2);
    var datumOfChild = left.getDatumAt(t);
    var dividedNode = node.divideBy(t).right; // set with left of splitted node to node. and get splitted right node

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
      return true;
    }

    var _this2$insertChildren = _this2.insertChildrenNode(rawDatum, null, root),
        datumOfChild = _this2$insertChildren.datumOfChild,
        left = _this2$insertChildren.left,
        right = _this2$insertChildren.right;

    _this2._root = (0, _helper.isNotNull)(datumOfChild) ? new BTreeNode(datumOfChild, left, right, _this2.dim) : root;
  };

  this.insertChildrenNode = function (rawDatum, pNode, node) {
    var foundInfo = node.find(rawDatum);
    if (!foundInfo.isNotFound) return _constant.EMPTY_OBJ;
    var cNode = node.getChildAt(foundInfo.childIdx);

    if (node.isLeafNode()) {
      node.add(rawDatum);
      _this2.length++;
    } else {
      var _this2$insertChildren2 = _this2.insertChildrenNode(rawDatum, node, cNode),
          datumOfChild = _this2$insertChildren2.datumOfChild,
          left = _this2$insertChildren2.left,
          right = _this2$insertChildren2.right;

      if ((0, _helper.isNotNull)(datumOfChild)) {
        node.add(datumOfChild, left, right);
      }
    }

    return node.isFull() ? _this2._split(node) : _constant.EMPTY_OBJ;
  };

  this.remove = function () {};

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

var btree = new BTree(M);
var a1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20];
var a2 = [4, 2, 7, 1, 5, 3, 8];
var arr = a1;
console.log('----------------------------------');
arr.forEach(function (v) {
  console.log('ADDING ' + v + ' TO TREE');
  btree.insert(v);
});
console.log(' --- BEFORE REMOVING --- ');
btree.print(); // a.forEach((v) => {
//   console.log('----------------------------------');
//   console.log('REMOVING ' + v + ' FROM TREE');
//   console.log('');
//
//   console.assert( btree.remove(v) );
//   console.log(btree.toString());
// });