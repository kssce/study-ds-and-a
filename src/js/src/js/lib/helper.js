const isNotNull = (x) => (x !== null && x !== undefined);

const isExists = (...args) => (args.every(val => val !== null && val !== undefined));

export {
  isNotNull,
  isExists,
}
