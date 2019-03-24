export const JOIN_SESSION = 'JOIN_SESSION';
export const FETCH_ENTITY = 'FETCH_ENTITY';
export const RECEIVE_ENTITY = 'RECEIVE_ENTITY';
export const FETCH_COLLECTION = 'FETCH_COLLECTION';
export const RECEIVE_COLLECTION = 'RECEIVE_COLLECTION';

export const joinSession = (attendanceCode) => ({
  type: JOIN_SESSION,
  attendanceCode
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
