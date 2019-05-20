import { compose } from 'redux';
import { startSession } from '../actions';
import StartSessionForm from '../components/StartSessionForm';
import { getJob } from '../selectors';
import connectWithImmutables from '../utils/connectWithImmutables';
import withJob from './withJob';

const mapStateToProps = (state) => ({
  startJob: getJob(state, jobId),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (label) => (
    dispatch(startSession(label, jobId))
  ),
});

export default compose(
  connectWithImmutables(mapStateToProps, mapDispatchToProps),
  withJob(props => props.startJob),
)(StartSessionForm);

///////////////////////////////////////////////////////////////////////////////

const jobId = 'startSessionJob';
