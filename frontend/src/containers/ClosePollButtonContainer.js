import { compose } from 'redux';
import { connect } from 'react-redux';
import { updateEntity } from '../actions';
import { getJob } from '../selectors';
import withJob from './withJob';
import ClosePollButton from '../components/ClosePollButton';

const mapStateToProps = (state, { poll }) => ({
  closePollJob: getJob(state, jobId(poll)),
});

const mapDispatchToProps = (dispatch, { poll }) => ({
  onClose: () => setStatusToClosed(dispatch, poll),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withJob(props => props.closePollJob),
)(ClosePollButton);

///////////////////////////////////////////////////////////////////////////////

const jobId = (poll) => (
  `closePollJob:${poll.get('type')}:${poll.get('id')}`
);

const setStatusToClosed = (dispatch, poll) => {
  const updatedPoll = poll.setIn(['attributes', 'status'], 'closed');
  dispatch(updateEntity(updatedPoll, jobId(poll)))
};
