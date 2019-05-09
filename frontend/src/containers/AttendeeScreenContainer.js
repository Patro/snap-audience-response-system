import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
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
  prev.interactiveSession.id !== next.interactiveSession.id
);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withDependencies(shouldRefresh),
)(AttendeeScreen);

///////////////////////////////////////////////////////////////////////////////

const findUnrespondedPoll = (state, interactiveSession) => {
  const filterParams = buildFilterParams(interactiveSession);
  const collection = getCollection(state, POLL, filterParams);
  const pollId = get(collection, 'entities[0].id')
  if (pollId === undefined) {
    return undefined;
  }
  return getEntity(state, { type: POLL, id: pollId })
};

const fetchPolls = (dispatch, interactiveSession) => {
  dispatch(fetchCollection(POLL, buildFilterParams(interactiveSession)))
};

const buildFilterParams = (interactiveSession) => ({
  interactiveSessionId: interactiveSession.id,
  status: 'open',
  responded: false,
});
