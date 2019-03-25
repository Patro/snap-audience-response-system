import isObject from 'lodash/isObject';

const deepMapKeys = (object, iteratee) => {
  const mapped = {}
  Object.keys(object).forEach((key) => {
    let value = object[key];
    if(isObject(value)) {
      value = deepMapKeys(value, iteratee);
    }
    mapped[iteratee(key)] = value;
  });
  return mapped;
};

export default deepMapKeys;
