export const JOIN_SESSION = 'JOIN_SESSION';
export const CREATE_ENTITY = 'CREATE_ENTITY';
export const FETCH_ENTITY = 'FETCH_ENTITY';
export const RECEIVE_ENTITY = 'RECEIVE_ENTITY';
export const FETCH_COLLECTION = 'FETCH_COLLECTION';
export const RECEIVE_COLLECTION = 'RECEIVE_COLLECTION';
export const CREATE_JOB = 'CREATE_JOB';

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

export const createJob = (id) => ({
  type: CREATE_JOB,
  id
});
