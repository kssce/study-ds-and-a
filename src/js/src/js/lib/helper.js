const isNotNull = (x) => (x !== null && x !== undefined);

const isExists = (...args) => (args.every(val => val !== null && val !== undefined));

const isNotExist = (x) => (x === null || x === undefined);

export {
  isNotNull,
  isExists,
  isNotExist,
}
