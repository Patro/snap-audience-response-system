import Immutable from 'immutable';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getCollection, getEntity } from '../selectors';
import AttendeeScreen from '../components/AttendeeScreen';
import withDependencies from './withDependencies';

const mapStateToProps = (state, { interactiveSession }) => ({
  unrespondedPoll: findUnrespondedPoll(state, interactiveSession),
});

const mapDispatchToProps = (dispatch, { interactiveSession }) => ({
  onRefresh: () => fetchPolls(dispatch, interactiveSession),
});

const shouldRefresh = (prev, next) => (
  prev.interactiveSession.get('id') !== next.interactiveSession.get('id')
);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(AttendeeScreen);

///////////////////////////////////////////////////////////////////////////////

const findUnrespondedPoll = (state, interactiveSession) => {
  const filterParams = buildFilterParams(interactiveSession);
  const collection = getCollection(state, POLL, filterParams);
  if (collection === undefined) { return; }
  const pollId = collection.getIn(['entities', 0, 'id']);
  if (pollId === undefined) { return; }
  return getEntity(state, { type: POLL, id: pollId })
};

const fetchPolls = (dispatch, interactiveSession) => {
  dispatch(fetchCollection(POLL, buildFilterParams(interactiveSession)))
};

const buildFilterParams = (interactiveSession) => Immutable.fromJS({
  interactiveSessionId: interactiveSession.get('id'),
  status: 'open',
  responded: false,
});
