import { connect } from 'react-redux';
import { joinSession } from '../actions';
import JoinSessionForm from '../components/JoinSessionForm';
import { getJob } from '../selectors';

const mapStateToProps = (state) => ({
  joinJob: getJob(state, jobId),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (attendance_code) => (
    dispatch(joinSession(attendance_code, jobId))
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinSessionForm)

///////////////////////////////////////////////////////////////////////////////

const jobId = 'joinSessionJob';
