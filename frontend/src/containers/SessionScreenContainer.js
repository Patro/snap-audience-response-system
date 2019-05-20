import { compose } from 'redux';
import { fetchEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import { getEntity } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withDependencies from './withDependencies';
import SessionScreen from '../components/SessionScreen';

const mapStateToProps = (state, ownProps) => ({
  interactiveSession: getInteractiveSession(state, getId(ownProps)),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefresh: () => fetchInteractiveSession(dispatch, getId(ownProps)),
});

const shouldRefresh = (prev, next) => getId(prev) !== getId(next);

export default compose(
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(SessionScreen);

///////////////////////////////////////////////////////////////////////////////

const getId = (props) => (
  props.match.params.id
);

const getInteractiveSession = (state, id) => (
  getEntity(state, { type: INTERACTIVE_SESSION, id })
);

const fetchInteractiveSession = (dispatch, id) => (
  dispatch(fetchEntity(INTERACTIVE_SESSION, id))
);
