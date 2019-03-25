export const JOIN_SESSION = 'JOIN_SESSION';
export const CREATE_ENTITY = 'CREATE_ENTITY';
export const FETCH_ENTITY = 'FETCH_ENTITY';
export const RECEIVE_ENTITY = 'RECEIVE_ENTITY';
export const FETCH_COLLECTION = 'FETCH_COLLECTION';
export const RECEIVE_COLLECTION = 'RECEIVE_COLLECTION';
export const MARK_JOB_AS_STARTED = 'MARK_JOB_AS_STARTED';
export const MARK_JOB_AS_SUCCEEDED = 'MARK_JOB_AS_SUCCEEDED';
export const MARK_JOB_AS_FAILED = 'MARK_JOB_AS_FAILED';
export const REMOVE_JOB = 'REMOVE_JOB';

export const joinSession = (attendanceCode, jobId = 'joinSession') => ({
  type: JOIN_SESSION,
  attendanceCode,
  jobId
});

export const createEntity = (entity) => ({
  type: CREATE_ENTITY,
  entity
});

export const fetchEntity = (entityType, entityId) => ({
  type: FETCH_ENTITY,
  entityType,
  entityId
});

export const receiveEntity = (entity) => ({
  type: RECEIVE_ENTITY,
  entity
});

export const fetchCollection = (entityType, filterParams) => ({
  type: FETCH_COLLECTION,
  entityType,
  filterParams
});

export const receiveCollection = (entityType, filterParams, collection) => ({
  type: RECEIVE_COLLECTION,
  entityType,
  filterParams,
  collection
});

export const markJobAsStarted = (id) => ({
  type: MARK_JOB_AS_STARTED,
  id,
});

export const markJobAsSucceeded = (id, result) => ({
  type: MARK_JOB_AS_SUCCEEDED,
  id,
  result
});

export const markJobAsFailed = (id, errors) => ({
  type: MARK_JOB_AS_FAILED,
  id,
  errors
});

export const removeJob = (id) => ({
  type: REMOVE_JOB,
  id
});
