import { connect } from 'react-redux';
import { startSession } from '../actions';
import StartSessionForm from '../components/StartSessionForm';
import { getJob } from '../selectors';

const mapStateToProps = (state) => ({
  startJob: getJob(state, jobId),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (label) => (
    dispatch(startSession(label, jobId))
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartSessionForm)

///////////////////////////////////////////////////////////////////////////////

const jobId = 'startSessionJob';
