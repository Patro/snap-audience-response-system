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

const jobs = (state = {}, action) => {
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

const markJobAsStarted = (state, jobId, trigger) => ({
  ...state,
  [jobId]: {
    id: jobId,
    status: STARTED,
    trigger
  },
});

const markJobAsSucceeded = (state, jobId, result) => ({
  ...state,
  [jobId]: {
    id: jobId,
    status: SUCCEEDED,
    trigger: state[jobId].trigger,
    result,
  },
});

const markJobAsFailed = (state, jobId, errors) => ({
  ...state,
  [jobId]: {
    id: jobId,
    status: FAILED,
    trigger: state[jobId].trigger,
    errors,
  },
});

const removeJob = (state, jobId) => {
  const clone = { ...state };
  delete clone[jobId];
  return clone;
};
