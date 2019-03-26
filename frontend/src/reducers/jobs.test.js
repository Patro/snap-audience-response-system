import jobs from './jobs';
import {
  markJobAsStarted,
  markJobAsSucceeded,
  markJobAsFailed,
  removeJob
} from '../actions';
import {
  STARTED,
  SUCCEEDED,
  FAILED,
} from '../constants/jobStatus';

describe('jobs reducer', () => {
  describe('on MARK_JOB_AS_STARTED', () => {
    describe('when job does not exist', () => {
      it('should create new job', () => {
        const stateBefore = {
          'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
        };
        const action = markJobAsStarted('testJob');
        const stateAfter = {
          'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
          'testJob': { id: 'testJob', status: STARTED },
        };

        expect(jobs(stateBefore, action)).toEqual(stateAfter);
      });
    });

    describe('when job exists', () => {
      it('should update status and remove additional keys', () => {
        const stateBefore = {
          'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
          'testJob': { id: 'testJob', status: FAILED, errors: [] },
        };
        const action = markJobAsStarted('testJob');
        const stateAfter = {
          'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
          'testJob': { id: 'testJob', status: STARTED },
        };

        expect(jobs(stateBefore, action)).toEqual(stateAfter);
      });
    });
  });

  describe('on MARK_JOB_AS_SUCCEEDED', () => {
    it('should update status, set result and remove additional keys', () => {
      const stateBefore = {
        'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
        'testJob': { id: 'testJob', status: FAILED, errors: [] },
      };
      const action = markJobAsSucceeded('testJob', 'result');
      const stateAfter = {
        'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
        'testJob': { id: 'testJob', status: SUCCEEDED, result: 'result' },
      };

      expect(jobs(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('on MARK_JOB_AS_FAILED', () => {
    it('should update status, set errors and remove additional keys', () => {
      const stateBefore = {
        'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
        'testJob': { id: 'testJob', status: SUCCEEDED, result: 'result' },
      };
      const action = markJobAsFailed('testJob', ['error']);
      const stateAfter = {
        'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
        'testJob': { id: 'testJob', status: FAILED, errors: ['error'] },
      };

      expect(jobs(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('on REMOVE_JOB', () => {
    it('should remove job from store', () => {
      const stateBefore = {
        'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
        'testJob': { id: 'testJob', status: SUCCEEDED, result: 'result' },
      };
      const action = removeJob('testJob');
      const stateAfter = {
        'otherJob': { id: 'otherJob', status: FAILED, errors: [] },
      };

      expect(jobs(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
