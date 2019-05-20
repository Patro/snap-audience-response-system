import { connect } from 'react-redux';
import arePropsWithImmutablesEqual from './arePropsWithImmutablesEqual';

const connectWithImmutables = (
  mapStateToProps = null,
  mapDispatchToProps = null,
  mergeProps = null,
  options = {}
) => (
  connect(mapStateToProps, mapDispatchToProps, mergeProps, {
    areStatePropsEqual: arePropsWithImmutablesEqual,
    ...options,
  })
);

export default connectWithImmutables;
