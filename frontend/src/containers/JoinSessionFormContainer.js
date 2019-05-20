import { compose } from 'redux';
import { joinSession } from '../actions';
import { getJob } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withJob from './withJob';
import JoinSessionForm from '../components/JoinSessionForm';

const mapStateToProps = (state) => ({
  joinJob: getJob(state, jobId),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (attendance_code) => (
    dispatch(joinSession(attendance_code, jobId))
  ),
});

export default compose(
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
  withJob(props => props.joinJob),
)(JoinSessionForm);

///////////////////////////////////////////////////////////////////////////////

const jobId = 'joinSessionJob';
