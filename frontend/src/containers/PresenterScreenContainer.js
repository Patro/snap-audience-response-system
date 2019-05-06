import { connect } from 'react-redux';
import { fetchEntity } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getEntity } from '../selectors';
import PresenterScreen from '../components/PresenterScreen';

const mapStateToProps = (state, { match: { params: { pollId } } }) => ({
  poll: getEntity(state, { type: POLL, id: pollId }),
});

const mapDispatchToProps = (dispatch, { match: { params: { pollId } } }) => ({
  onRefresh: () => dispatch(fetchEntity(POLL, pollId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PresenterScreen);
