export const JOIN_SESSION = 'JOIN_SESSION';
export const START_SESSION = 'START_SESSION';
export const SAVE_QUESTION = 'SAVE_QUESTION';
export const CREATE_ENTITY = 'CREATE_ENTITY';
export const FETCH_ENTITY = 'FETCH_ENTITY';
export const RECEIVE_ENTITY = 'RECEIVE_ENTITY';
export const FETCH_COLLECTION = 'FETCH_COLLECTION';
export const RECEIVE_COLLECTION = 'RECEIVE_COLLECTION';
export const MARK_JOB_AS_STARTED = 'MARK_JOB_AS_STARTED';
export const MARK_JOB_AS_SUCCEEDED = 'MARK_JOB_AS_SUCCEEDED';
export const MARK_JOB_AS_FAILED = 'MARK_JOB_AS_FAILED';
export const REMOVE_JOB = 'REMOVE_JOB';

let jobId = 0;
const nextJobId = () => jobId++;

export const joinSession = (attendanceCode, jobId = nextJobId()) => ({
  type: JOIN_SESSION,
  attendanceCode,
  jobId
});

export const startSession = (label, jobId = nextJobId()) => ({
  type: START_SESSION,
  label,
  jobId
});

export const saveQuestion = (question, options, jobId = nextJobId()) => ({
  type: SAVE_QUESTION,
  question,
  options,
  jobId
});

export const createEntity = (entity, jobId = nextJobId()) => ({
  type: CREATE_ENTITY,
  entity,
  jobId
});

export const fetchEntity = (entityType, entityId, jobId = nextJobId()) => ({
  type: FETCH_ENTITY,
  entityType,
  entityId,
  jobId
});

export const receiveEntity = (entity) => ({
  type: RECEIVE_ENTITY,
  entity
});

export const fetchCollection = (entityType, filterParams, jobId = nextJobId()) => ({
  type: FETCH_COLLECTION,
  entityType,
  filterParams,
  jobId
});

export const receiveCollection = (entityType, filterParams, collection) => ({
  type: RECEIVE_COLLECTION,
  entityType,
  filterParams,
  collection
});

export const markJobAsStarted = (id, trigger) => ({
  type: MARK_JOB_AS_STARTED,
  id,
  trigger
});

export const markJobAsSucceeded = (id, result) => ({
  type: MARK_JOB_AS_SUCCEEDED,
  id,
  result
});

export const markJobAsFailed = (id, errors) => ({
  type: MARK_JOB_AS_FAILED,
  id,
  errors,
});

export const removeJob = (id) => ({
  type: REMOVE_JOB,
  id
});
