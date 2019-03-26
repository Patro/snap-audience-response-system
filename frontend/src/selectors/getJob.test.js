import getJob from './getJob';

describe('getJob', () => {
  describe('given state with jobs', () => {
    const state = {
      jobs: {
        'testJob': { id: 'testJob'}
      },
    };

    describe('when job with id exists', () => {
      it('returns job', () => {
        expect(getJob(state, 'testJob')).toEqual({ id: 'testJob' });
      });
    });

    describe('when job with id does not exist', () => {
      it('returns undefined', () => {
        expect(getJob(state, 'otherJob')).toBeUndefined();
      });
    });
  });

  describe('given empty state', () => {
    const state = {};

    it('returns undefined', () => {
      expect(getJob(state, 'testJob')).toBeUndefined();
    });
  });
});
