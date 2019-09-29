import _ from 'lodash';
import PQueue from '../basic/PQueue';
import { isNotNull } from '../lib/helper';



/**
 * initialize array with val by ELEM_CNT * ELEM_CNT
 * @param ELEM_CNT
 * @param val
 * @returns {[]}
 */
const initBy = (ELEM_CNT, val) => {
  const arr = [];
  _.times(ELEM_CNT, () => {
    const innerArr = [];
    _.times(ELEM_CNT, () => {
      innerArr.push(val);
    });
    arr.push(innerArr);
  });
  return arr;
};


const dijkstra = (graph, start) => {
  // initialize distance list, visited list
  const dist = [];
  const visited = [];
  const rst = []; // data structure: { prev: previous vertex index, cost: shortest distance value }
  _.times(ELEM_CNT, () => {
    dist.push(Infinity);
    visited.push(false);
    rst.push({ prev: null, cost: Infinity });
  });
  rst[start].cost = 0;
  dist[start] = 0;

  // initialize binary heap and enqueue first element
  const pQ = new PQueue(100, (a, b) => (a.cost < b.cost)); // ascending order
  pQ.enqueue({ v: start, cost: dist[start] }); // data structure: { v: vertex index, cost: shortest distance value }

  while (!pQ.isEmpty()) {
    const currInfo = pQ.dequeue();
    const currVertex = currInfo.v;

    if (visited[currVertex]) continue;

    const curAdjList = graph[currVertex];

    curAdjList.forEach((cost, adjVertex) => {
      if (cost === Infinity) return;

      const shortestAdjCost = dist[adjVertex];
      const accCurrCost = dist[currVertex] + cost;

      if (accCurrCost < shortestAdjCost) {
        dist[adjVertex] = accCurrCost;
        rst[adjVertex] = { prev: currVertex, cost: accCurrCost };

        if (!visited[adjVertex]) {
          pQ.enqueue({ v: adjVertex, cost: accCurrCost });
        }
      }
    });
    visited[currVertex] = true;
  }
  return rst;
};

const printPath = (costList) => { // costList = [{ prev: previous vertex idx, cost }]
  const alias = ['A', 'B', 'C', 'D', 'E'];

  console.log(
    costList.map(({ prev: prevIdx, cost }, curr) => {
      let rstStr = '';
      let prev = prevIdx;

      while (isNotNull(prev)) {
        rstStr += ` <- ${alias[prev]}`;
        prev = isNotNull(costList[prev]) ? costList[prev].prev : null;
      }
      if (cost === Infinity) rstStr = ' is broken';
      return `total cost is ${cost} : ${alias[curr]}${rstStr}`;
    }).join('\n')
  );
};



// [ Test code ]
const A = 0, B = 1, C = 2, D = 3, E = 4;
const ELEM_CNT = 5;
const graph = initBy(ELEM_CNT, Infinity);
graph[A][B] = 10;
graph[A][C] = 5;
graph[B][C] = 2;
graph[C][B] = 3;
graph[B][D] = 1;
graph[C][D] = 9;
graph[C][E] = 2;
graph[E][A] = 7;
graph[E][D] = 6;
graph[D][E] = 4;

const costList = dijkstra(graph, A);

console.log('----------- [ Result ] ------------');
console.log(costList);
printPath(costList);
