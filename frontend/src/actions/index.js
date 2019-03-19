export const JOIN_SESSION = 'JOIN_SESSION';
export const FETCH_ENTITY = 'FETCH_ENTITY';
export const RECEIVE_ENTITY = 'RECEIVE_ENTITY';

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
