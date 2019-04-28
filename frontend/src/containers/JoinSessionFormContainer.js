import { compose } from 'redux';
import { connect } from 'react-redux';
import { joinSession } from '../actions';
import JoinSessionForm from '../components/JoinSessionForm';
import { getJob } from '../selectors';
import withJob from './withJob';

const mapStateToProps = (state) => ({
  joinJob: getJob(state, jobId),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (attendance_code) => (
    dispatch(joinSession(attendance_code, jobId))
  ),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withJob(props => props.joinJob),
)(JoinSessionForm);

///////////////////////////////////////////////////////////////////////////////

const jobId = 'joinSessionJob';
