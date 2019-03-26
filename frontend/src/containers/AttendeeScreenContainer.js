import { connect } from 'react-redux';
import get from 'lodash/get';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getCollection, getEntity } from '../selectors';
import AttendeeScreen from '../components/AttendeeScreen';

const mapStateToProps = (state, { interactiveSession }) => ({
  unrespondedPoll: findUnrespondedPoll(state, interactiveSession),
});

const mapDispatchToProps = (dispatch, { interactiveSession }) => ({
  onRefresh: () => fetchPolls(dispatch, interactiveSession),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendeeScreen);

///////////////////////////////////////////////////////////////////////////////

const findUnrespondedPoll = (state, interactiveSession) => {
  const filterParams = buildFilterParams(interactiveSession);
  const collection = getCollection(state, POLL, filterParams);
  const pollId = get(collection, 'entities[0].id')
  if (pollId === undefined) {
    return undefined;
  }
  return getEntity(state, POLL, pollId)
};

const fetchPolls = (dispatch, interactiveSession) => {
  dispatch(fetchCollection(POLL, buildFilterParams(interactiveSession)))
};

const buildFilterParams = (interactiveSession) => ({
  interactiveSessionId: interactiveSession.id,
  status: 'open',
  responded: false,
});
