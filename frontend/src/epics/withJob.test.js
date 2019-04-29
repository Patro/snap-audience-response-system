import { of, throwError } from 'rxjs';
import { toArray, mergeMap, map } from 'rxjs/operators';
import {
  markJobAsStarted, markJobAsSucceeded, markJobAsFailed, removeJob
} from '../actions';
import withJob from './withJob';

class TestWrapper {
  constructor({ trigger, wrapped$, onSuccess } = {}) {
    this.root$ = of('root');
    this.trigger = trigger;
    this.wrapped$ = wrapped$;
    this.onSuccess = onSuccess;
  }

  call$() {
    return this.root$.pipe(
      mergeMap(_ => withJob(this.trigger, this.wrapped$, this.onSuccess)),
      toArray(),
    )
  }
}

describe('withJob', () => {
  let trigger, withJob;

  beforeEach(() => {
    trigger = { jobId: 'jobId' };
    withJob = new TestWrapper({
      onSuccess: map(() => 'pipedResult'),
      trigger,
    });
  });

  describe('when wrapped observable succeeds', () => {
    beforeEach(() => {
      withJob.wrapped$ = of('innerResult');
    });

    it('emits mark job as succeeded action', (done) => {
      const expectedEvents = [
        markJobAsStarted('jobId', trigger),
        'pipedResult',
        markJobAsSucceeded('jobId', 'innerResult'),
        removeJob('jobId'),
      ]

      const result$ = withJob.call$();
      result$.subscribe(actions => {
        expect(actions).toEqual(expectedEvents);
        done();
      });
    });
  });

  describe('when wrapped observable fails with response', () => {
    let errors;

    beforeEach(() => {
      errors = [{ title: 'error' }];
      const error = { response: { errors } };
      withJob.wrapped$ = throwError(error);
    });

    it('emits mark job as failed action', (done) => {
      const expectedEvents = [
        markJobAsStarted('jobId', trigger),
        markJobAsFailed('jobId', errors),
        removeJob('jobId'),
      ]

      const result$ = withJob.call$();
      result$.subscribe(actions => {
        expect(actions).toEqual(expectedEvents);
        done();
      });
    });
  });

  describe('when wrapped observable fails with empty response', () => {

    beforeEach(() => {
      const error = { response: null };
      withJob.wrapped$ = throwError(error);
    });

    it('emits mark job as failed action', (done) => {
      const expectedEvents = [
        markJobAsStarted('jobId', trigger),
        markJobAsFailed('jobId', []),
        removeJob('jobId'),
      ]

      const result$ = withJob.call$();
      result$.subscribe(actions => {
        expect(actions).toEqual(expectedEvents);
        done();
      });
    });
  });
});
