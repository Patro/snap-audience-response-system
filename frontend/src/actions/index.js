export const JOIN_SESSION = 'JOIN_SESSION';

export const joinSession = (attendanceCode) => ({
  type: JOIN_SESSION,
  attendanceCode
});
