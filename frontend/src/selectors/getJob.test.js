import Immutable from 'immutable';
import buildTestState from '../utils/buildTestState';
import getJob from './getJob';

describe('getJob', () => {
  describe('given state with jobs', () => {
    const job = Immutable.Map({ id: 'testJob' });
    const state = buildTestState({ jobs: [job] });

    describe('when job with id exists', () => {
      it('returns job', () => {
        expect(getJob(state, 'testJob')).toEqual(job);
      });
    });

    describe('when job with id does not exist', () => {
      it('returns undefined', () => {
        expect(getJob(state, 'otherJob')).toBeUndefined();
      });
    });
  });

  describe('given empty state', () => {
    const state = Immutable.Map();

    it('returns undefined', () => {
      expect(getJob(state, 'testJob')).toBeUndefined();
    });
  });
});
