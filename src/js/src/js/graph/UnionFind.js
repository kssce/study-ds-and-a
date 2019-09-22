import { isNotNull } from '../lib/helper';

// getKey를 통해 멤버 변수 key를 리턴하는 데이터 형(이터페이스)를 element 로 갖는다
// getData를 통해 멤버 변수 data를 리턴하는 데이터 형(이터페이스)를 element 로 갖는다
class UnionFind {
  constructor(elemSet) {
    this.parent = {};
    this.height = {};
    this.init(elemSet);
  }

  init = (elemSet) => {
    elemSet.forEach(item => { this.setParent(item.getKey()); });
  };

  add = (elem) => {
    const id = elem.getKey();
    if (isNotNull(parent[id])) return;

    parent[id] = id;
  };

  setParent = (id, height = 0) => {
    this.parent[id] = id;
    this.height[id] = height;
  };

  // O(lgN)
  find = (x) => (this.parent[x] === x) ? x : this.find(this.parent[x]);

  isFullArgs = (x, y) => (isNotNull(x) && isNotNull(y));

  // O(α(N)) (에커만 함수로, 2^65536일때 5가 된다. 상수라고 봐도 된다.)
  union = (x, y) => {
    if (this.areSetsTheseProc(x, y)) return;
    console.log('> union: ', x.getData(), ' and ', y.getData());

    const [rootWithX, rootWithY] = this.getRootForThese(x, y);
    const xHeight = this.height[rootWithX];
    const yHeight = this.height[rootWithY];

    if (xHeight > yHeight) { // x가 y보다 더 높으면 x에 y를 추가
      this.parent[rootWithY] = rootWithX;

    } else {
      if (xHeight === yHeight) this.height[rootWithY]++;
      this.parent[rootWithX] = rootWithY;
    }
  };

  areSetsThese = (x, y) => {
    if (!this.isFullArgs(x, y)) return false;
    return this.areSetsTheseProc(x, y);
  };

  areSetsTheseProc = (x, y) => {
    const [rootWithX, rootWithY] = this.getRootForThese(x, y);
    return rootWithX === rootWithY;
  };

  getRootForThese = (x, y) => {
    const rootWithX = this.find(x.getKey());
    const rootWithY = this.find(y.getKey());
    return [rootWithX, rootWithY];
  };

}


export default UnionFind;



// [ 초기 객체 버전 ]
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
