import Immutable from 'immutable';
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
        const stateBefore = Immutable.fromJS({
          'otherJob': {
            id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
          },
        });
        const action = markJobAsStarted('testJob', 'b');
        const stateAfter = Immutable.fromJS({
          'otherJob': {
            id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
          },
          'testJob': {
            id: 'testJob', status: STARTED, trigger: 'b',
          },
        });

        expect(jobs(stateBefore, action)).toEqual(stateAfter);
      });
    });

    describe('when job exists', () => {
      it('should replace job', () => {
        const stateBefore = Immutable.fromJS({
          'otherJob': {
            id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
          },
          'testJob': {
            id: 'testJob', status: FAILED, errors: [], trigger: 'b',
          },
        });
        const action = markJobAsStarted('testJob', 'c');
        const stateAfter = Immutable.fromJS({
          'otherJob': {
            id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
          },
          'testJob': {
            id: 'testJob', status: STARTED, trigger: 'c',
          },
        });

        expect(jobs(stateBefore, action)).toEqual(stateAfter);
      });
    });
  });

  describe('on MARK_JOB_AS_SUCCEEDED', () => {
    it('should update status, set result and keep trigger', () => {
      const stateBefore = Immutable.fromJS({
        'otherJob': {
          id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
        },
        'testJob': {
          id: 'testJob', status: FAILED, errors: [], trigger: 'b',
        },
      });
      const action = markJobAsSucceeded('testJob', 'result');
      const stateAfter = Immutable.fromJS({
        'otherJob': {
          id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
        },
        'testJob': {
          id: 'testJob', status: SUCCEEDED, result: 'result', trigger: 'b',
        },
      });

      expect(jobs(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('on MARK_JOB_AS_FAILED', () => {
    it('should update status, set errors and keep trigger', () => {
      const stateBefore = Immutable.fromJS({
        'otherJob': {
          id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
        },
        'testJob': {
          id: 'testJob', status: SUCCEEDED, result: 'result', trigger: 'b',
        },
      });
      const action = markJobAsFailed('testJob', ['error']);
      const stateAfter = Immutable.fromJS({
        'otherJob': {
          id: 'otherJob', status: FAILED, errors: [], trigger: 'a'
         },
        'testJob': {
          id: 'testJob', status: FAILED, errors: ['error'], trigger: 'b'
        },
      });

      expect(jobs(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('on REMOVE_JOB', () => {
    it('should remove job from store', () => {
      const stateBefore = Immutable.fromJS({
        'otherJob': {
          id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
        },
        'testJob': { id: 'testJob', status: SUCCEEDED, result: 'result' },
      });
      const action = removeJob('testJob');
      const stateAfter = Immutable.fromJS({
        'otherJob': {
          id: 'otherJob', status: FAILED, errors: [], trigger: 'a',
        },
      });

      expect(jobs(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
