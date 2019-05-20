import Immutable from 'immutable';

const arePropsWithImmutablesEqual = (prev, next) => (
  Immutable.fromJS(prev).equals(Immutable.fromJS(next))
);

export default arePropsWithImmutablesEqual;
