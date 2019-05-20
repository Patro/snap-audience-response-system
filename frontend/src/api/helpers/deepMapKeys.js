import Immutable from 'immutable';

const deepMapKeys = (map, iteratee) => (
  map.mapEntries(([ key, value ]) => {
    if(Immutable.isMap(value)) {
      value = deepMapKeys(value, iteratee);
    }
    return [ iteratee(key), value ]
  })
);

export default deepMapKeys;
