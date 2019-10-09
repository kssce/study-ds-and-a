"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var M = 5;

var initByNull = function initByNull(list) {
  var len = list.length;

  for (var i = 0; i < len; i++) {
    list[i] = null;
  }

  return list;
};

var Data = function Data(_data, _key) {
  var _this = this;

  var _left = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var _right = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  _classCallCheck(this, Data);

  this.getKey = function () {
    return _this._key;
  };

  this.setKey = function (key) {
    _this._key = key;
  };

  this.getData = function () {
    return _this._data;
  };

  this.setData = function (data) {
    _this._data = data;
  };

  this.getLeft = function () {
    return _this._left;
  };

  this.setLeft = function (left) {
    _this._left = left;
  };

  this.getRight = function () {
    return _this._right;
  };

  this.setRight = function (right) {
    _this._right = right;
  };

  this.compareTo = function (target) {
    return _this._key - target.getKey();
  };

  this._key = _key;
  this._data = _data;
  this._left = _left; // left child

  this._right = _right; // right child
};

var BTreeNode = function BTreeNode() {
  var _this2 = this;

  var degree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : M;

  _classCallCheck(this, BTreeNode);

  this.isLeafNode = function () {
    return !_this2._children[0];
  };

  this.increaseDataCnt = function () {
    _this2._dataCnt++;
  };

  this.decreaseDataCnt = function () {
    _this2._dataCnt--;
  };

  this.setProxy = function (proxyMethod) {
    _this2.proxy = proxyMethod;
  };

  this.isFull = function () {
    return _this2._dataCnt + 1 >= _this2._degree;
  };

  this.initBy = function (dataInstance) {
    _this2._dataCnt = 1;
    _this2._dataList[0] = dataInstance;
    _this2._children[0] = dataInstance.getLeft();
    _this2._children[1] = dataInstance.getRight();
  };

  this.add = function (rawData) {
    var data = new Data(_this2.proxy(rawData).data, _this2.proxy(rawData).key);

    if (_this2.isLeafNode()) {
      return _this2.isFull() ? _this2.split(data) : _this2.insertData(data);
    } else {
      var childWithData = _this2.getChildWith(data);

      if (!childWithData) return null;
      var splittedChild = childWithData.add(data.getData());
      if (!splittedChild) return null;
      return _this2.isFull() ? _this2.split(splittedChild, splittedChild.getRight()) : _this2.insertSplittedChild(splittedChild);
    }
  };

  this.insertData = function (dataToInsert) {
    console.log(_this2.isLeafNode() ? 'leafNode' : 'internalNode');
    var dataIdx = _this2._dataCnt;
    var dataList = _this2._dataList;
    var prev = dataList[dataIdx - 1];

    while (dataIdx > 0 && prev && prev.compareTo(dataToInsert) > 0) {
      dataList[dataIdx] = dataList[dataIdx - 1];
      dataIdx--;
      prev = dataList[dataIdx - 1];
    }

    dataList[dataIdx] = dataToInsert;

    _this2.increaseDataCnt();

    return null;
  };

  this.insertSplittedChild = function (splittedChild) {
    var child = splittedChild.getLeft(); // splitted child
    // insert key with right child poped up from child node
    // case A: first child was split

    if (child === _this2._children[0]) {
      for (var i = _this2._dataCnt; i > 0; i--) {
        _this2._dataList[i] = _this2._dataList[i - 1];
        _this2._children[i + 1] = _this2._children[i];
      }

      _this2._dataList[0] = splittedChild;
      _this2._children[0] = child;
      _this2._children[1] = splittedChild.getRight(); // for (let i = this._dataCnt + 1; i > 1; i--) {
      //   this._children[i] = this._children[i - 1];
      // }
      // this._children[0] = child;
      // this._children[1] = splittedChild.getRight();
    } // case B: [key][split-child] (split child is on the right)
    else {
        var idx = _this2._dataCnt;

        while (idx > 0 && _this2._children[idx] !== child) {
          _this2._dataList[idx] = _this2._dataList[idx - 1];
          _this2._children[idx + 1] = _this2._children[idx];
          idx--;
        }

        _this2._dataList[idx] = splittedChild;
        _this2._children[idx + 1] = splittedChild.getRight();
      }

    _this2.increaseDataCnt();
  };

  this.getChildWith = function (data) {
    for (var i = 0; i < _this2._dataCnt; i++) {
      var currData = _this2._dataList[i];

      if (currData && data.getKey() <= currData.getKey()) {
        return _this2._children[i];
      }
    }

    return _this2._children[_this2._dataCnt];
  };

  this.split = function (data) {
    var rightChild = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var left = _this2,
        right = new BTreeNode();

    var dataList = _toConsumableArray(_this2._dataList),
        children = _toConsumableArray(_this2._children);

    dataList.push(null);
    children.push(null); // insert data and children

    var idx = dataList.length - 1;
    var prevData = dataList[idx - 1];

    while (idx > 0 && prevData && prevData.compareTo(data) > 0) {
      dataList[idx] = prevData;
      children[idx + 1] = children[idx];
      idx--;
      prevData = dataList[idx - 1];
    }

    dataList[idx] = data;
    children[idx + 1] = rightChild; // split into two children and dataList

    var midIdx = Math.floor(dataList.length / 2);

    var midData = _this2._dataList[midIdx].getData(); // fix left child dataList and children


    for (var i = 0; i < dataList.length; i++) {
      if (i < midIdx) {
        left._children[i] = children[i];
        left._dataList[i] = dataList[i];
      } else if (i === midIdx) {
        left._children[i] = children[i];
        left._dataList[i] = null;
      } else {
        left._children[i] = _this2._dataList[i] = null;
      }
    }

    left._dataCnt = midIdx; // fix right child dataList and children

    for (var _i = 0; _i < dataList.length - midIdx; _i++) {
      right._dataList[_i] = dataList[_i + midIdx + 1];
      right._children[_i] = children[_i + midIdx + 1];
      right.increaseDataCnt();
    }

    right._children[dataList.length - midIdx - 1] = children[dataList.length];
    return new Data(_this2.proxy(midData).data, _this2.proxy(midData).key, left, right); // ({ left, key: midData, right });
  };

  this.remove = function (data) {};

  this.rebalance = function (childIndex) {};

  this.mergeChildren = function (leftIndex) {};

  this.extractMax = function () {};

  this.indexOfKey = function () {};

  this.removeKey = function (key) {};

  this.toString = function (indentOpt) {
    var INDENT_STRING = '  ';
    indentOpt = indentOpt || '';

    if (_this2.isLeafNode()) {
      return indentOpt + '[' + _this2._dataList.slice(0, _this2._dataCnt).join(', ') + ']';
    }

    var str = '';
    var childIndent = indentOpt + INDENT_STRING;

    var childStrings = _this2._children.slice(0, _this2._dataCnt + 1).map(function (child) {
      return child ? child.toString(childIndent) : '';
    });

    str = indentOpt + '[\n' + childStrings[0] + '\n';

    for (var i = 1; i < childStrings.length; i += 1) {
      var prevData = _this2._dataList[i - 1];
      str += childIndent + (prevData ? prevData.toString() : null) + '\n' + childStrings[i] + '\n';
    }

    str += indentOpt + ']';
    return str;
  };

  this._dataList = initByNull(Array(M)); // Element by instance of Data

  this._children = initByNull(Array(M + 1));
  this._dataCnt = 0;
  this._degree = degree;

  this.proxy = function (data) {
    return {
      key: data,
      data: data
    };
  };
};

BTreeNode.fromSplit = function (split) {
  var node = new BTreeNode();
  node.initBy(split);
  return node;
};

var BTree = function BTree() {
  var _this3 = this;

  _classCallCheck(this, BTree);

  this.add = function (rawData) {
    var curr = _this3._root;
    var split = curr.add(rawData);
    if (!split) return;
    _this3._root = BTreeNode.fromSplit(split);
  };

  this.remove = function () {};

  this.toString = function () {
    return _this3._root.toString();
  };

  this._root = new BTreeNode();
};

var btree = new BTree();
var a1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20];
var a2 = [4, 2, 7, 1, 5, 3, 8];
var a = a1;
a.forEach(function (v) {
  console.log('----------------------------------');
  console.log('ADDING ' + v + ' TO TREE');
  console.log('');
  btree.add(v);
  console.log(btree.toString());
}); // console.log(' --- BEFORE REMOVING --- ');
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