import { compose } from 'redux';
import { fetchCollection } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import { getEntitiesOfCollection } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withDependencies from './withDependencies';
import SessionList from '../components/SessionList';

const mapStateToProps = (state) => ({
  interactiveSessions: getEntitiesOfCollection(state, INTERACTIVE_SESSION, {}),
});

const mapDispatchToProps = (dispatch) => ({
  onRefresh: () => dispatch(fetchCollection(INTERACTIVE_SESSION, {})),
});

export default compose(
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
  withDependencies(() => false),
)(SessionList);
