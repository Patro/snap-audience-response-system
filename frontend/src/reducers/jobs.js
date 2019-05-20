import Immutable from 'immutable';
import {
  MARK_JOB_AS_STARTED,
  MARK_JOB_AS_SUCCEEDED,
  MARK_JOB_AS_FAILED,
  REMOVE_JOB
} from '../actions';
import {
  STARTED,
  SUCCEEDED,
  FAILED
} from '../constants/jobStatus';


const jobs = (state = Immutable.fromJS({}), action) => {
  switch(action.type) {
    case MARK_JOB_AS_STARTED:
      return markJobAsStarted(state, action.id, action.trigger);
    case MARK_JOB_AS_SUCCEEDED:
      return markJobAsSucceeded(state, action.id, action.result);
    case MARK_JOB_AS_FAILED:
      return markJobAsFailed(state, action.id, action.errors);
    case REMOVE_JOB:
      return removeJob(state, action.id);
    default:
      return state;
  };
};

export default jobs;

///////////////////////////////////////////////////////////////////////////////

const markJobAsStarted = (state, jobId, trigger) => (
  state.set(jobId, Immutable.Map({
    id: jobId,
    status: STARTED,
    trigger
  }))
);

const markJobAsSucceeded = (state, jobId, result) => (
  state.set(jobId, Immutable.Map({
    id: jobId,
    status: SUCCEEDED,
    trigger: state.getIn([jobId, 'trigger']),
    result,
  }))
);

const markJobAsFailed = (state, jobId, errors) => (
  state.set(jobId, Immutable.Map({
    id: jobId,
    status: FAILED,
    trigger: state.getIn([jobId, 'trigger']),
    errors,
  }))
);

const removeJob = (state, jobId) => (
  state.remove(jobId)
);
