import { connect } from 'react-redux';
import get from 'lodash/get';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getCollection, getEntity } from '../selectors';
import AttendeeScreen from '../components/AttendeeScreen';

const buildFilterParams = (ownProps) => ({
  interactiveSessionId: ownProps.interactiveSession.id,
  status: 'open',
  responded: false,
})

const findUnrespondedPoll = (state, ownProps) => {
  const collection = getCollection(state, POLL, buildFilterParams(ownProps));
  const pollId = get(collection, 'entities[0].id')
  if (pollId === undefined) {
    return undefined;
  }
  return getEntity(state, POLL, pollId)
}

const mapStateToProps = (state, ownProps) => ({
  unrespondedPoll: findUnrespondedPoll(state, ownProps)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefresh: () => (
    dispatch(fetchCollection(POLL, buildFilterParams(ownProps)))
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendeeScreen);
