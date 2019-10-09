"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helper = require("../lib/helper");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// element has a data type that returns a member variable key by getKey
// element has a data type that returns a member variable data by getData
var UnionFind = function UnionFind(_elemSet) {
  var _this = this;

  _classCallCheck(this, UnionFind);

  this.init = function (elemSet) {
    elemSet.forEach(function (item) {
      _this.setParent(item.getKey());
    });
  };

  this.add = function (elem) {
    var id = elem.getKey();
    if ((0, _helper.isNotNull)(parent[id])) return;
    parent[id] = id;
  };

  this.setParent = function (id) {
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    _this.parent[id] = id;
    _this.height[id] = height;
  };

  this.find = function (x) {
    return _this.parent[x] === x ? x : _this.find(_this.parent[x]);
  };

  this.isFullArgs = function (x, y) {
    return (0, _helper.isNotNull)(x) && (0, _helper.isNotNull)(y);
  };

  this.union = function (x, y) {
    if (_this.areSetsTheseProc(x, y)) return;
    console.log('> union: ', x.getData(), ' and ', y.getData());

    var _this$getRootForThese = _this.getRootForThese(x, y),
        _this$getRootForThese2 = _slicedToArray(_this$getRootForThese, 2),
        rootWithX = _this$getRootForThese2[0],
        rootWithY = _this$getRootForThese2[1];

    var xHeight = _this.height[rootWithX];
    var yHeight = _this.height[rootWithY];

    if (xHeight > yHeight) {
      // if xHeight > yHeight then insertion y to set of x
      _this.parent[rootWithY] = rootWithX;
    } else {
      if (xHeight === yHeight) _this.height[rootWithY]++;
      _this.parent[rootWithX] = rootWithY;
    }
  };

  this.areSetsThese = function (x, y) {
    if (!_this.isFullArgs(x, y)) return false;
    return _this.areSetsTheseProc(x, y);
  };

  this.areSetsTheseProc = function (x, y) {
    var _this$getRootForThese3 = _this.getRootForThese(x, y),
        _this$getRootForThese4 = _slicedToArray(_this$getRootForThese3, 2),
        rootWithX = _this$getRootForThese4[0],
        rootWithY = _this$getRootForThese4[1];

    return rootWithX === rootWithY;
  };

  this.getRootForThese = function (x, y) {
    var rootWithX = _this.find(x.getKey());

    var rootWithY = _this.find(y.getKey());

    return [rootWithX, rootWithY];
  };

  this.parent = {};
  this.height = {};
  this.init(_elemSet);
};

var _default = UnionFind; // [ version by object ]
// class UnionFind {
//   constructor(elemSet, key) {
//     this.parent = {};
//     this.height = {};
//     this.key = '';
//     this.init(elemSet, key);
//   }
//
//   init = (elemSet, key) => {
//     elemSet.forEach(item => { this.setParent(item[key]); });
//     this.key = key;
//   };
//
//   add = (elem) => {
//     const id = elem[this.key];
//     if (isNotNull(parent[id])) return;
//
//     parent[id] = id;
//   };
//
//   setParent = (id, height = 0) => {
//     this.parent[id] = id;
//     this.height[id] = height;
//   };
//
//   find = (x) => (this.parent[x] === x) ? x : this.find(this.parent[x]);
//
//   isFullArgs = (x, y) => (isNotNull(x) && isNotNull(y));
//
//   union = (x, y) => {
//     if (this.areSetsTheseProc(x, y)) return;
//     console.log('> union: ', x.data, ' and ', y.data);
//
//     const [rootWithX, rootWithY] = this.getRootForThese(x, y);
//     const xHeight = this.height[rootWithX];
//     const yHeight = this.height[rootWithY];
//
//     if (xHeight > yHeight) { // x가 y보다 더 높으면 x에 y를 추가
//       this.parent[rootWithY] = rootWithX;
//
//     } else {
//       if (xHeight === yHeight) this.height[rootWithY]++;
//       this.parent[rootWithX] = rootWithY;
//     }
//   };
//
//   areSetsThese = (x, y) => {
//     if (!this.isFullArgs(x, y)) return false;
//     return this.areSetsTheseProc(x, y);
//   };
//
//   areSetsTheseProc = (x, y) => {
//     const [rootWithX, rootWithY] = this.getRootForThese(x, y);
//     return rootWithX === rootWithY;
//   };
//
//   getRootForThese = (x, y) => {
//     const rootWithX = this.find(x[this.key]);
//     const rootWithY = this.find(y[this.key]);
//     return [rootWithX, rootWithY];
//   };
//
// }
// [ Test code ]
// const dummyList = [
//   {
//     offset: 1,
//     data: 'hello',
//   },
//   {
//     offset: 2,
//     data: 'flask',
//   },
//   {
//     offset: 3,
//     data: 'world',
//   },
//   {
//     offset: 4,
//     data: 'algorithm',
//   },
//   {
//     offset: 5,
//     data: 'structure',
//   },
// ];
// const u = new UnionFind(dummyList, 'offset');
// u.union(dummyList[0], dummyList[1]);
// console.log(`${dummyList[0].data} and ${dummyList[1].data} sets ? ${u.areSetsThese(dummyList[0], dummyList[1])}`);
// console.log(`${dummyList[0].data} and ${dummyList[2].data} sets ? ${u.areSetsThese(dummyList[0], dummyList[2])}`);
// u.union(dummyList[2], dummyList[4]);
// console.log(`${dummyList[0].data} and ${dummyList[2].data} sets ? ${u.areSetsThese(dummyList[1], dummyList[2])}`);
// u.union(dummyList[1], dummyList[4]);
// console.log(`${dummyList[0].data} and ${dummyList[2].data} sets ? ${u.areSetsThese(dummyList[1], dummyList[2])}`);
// console.log(`${dummyList[3].data} and ${dummyList[4].data} sets ? ${u.areSetsThese(dummyList[3], dummyList[4])}`);

exports["default"] = _default;