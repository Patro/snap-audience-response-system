import { of, throwError } from 'rxjs';
import { toArray, mergeMap, map } from 'rxjs/operators';
import {
  markJobAsStarted, markJobAsSucceeded, markJobAsFailed, removeJob
} from '../actions';
import withJob from './withJob';

const root$ = of('root')

const call = (wrapped$, pipe) => (
  root$.pipe(mergeMap(_ => withJob('jobId', wrapped$, pipe)), toArray())
)

describe('withJob', () => {
  describe('when wrapped observable succeeds', () => {
    const wrapped$ = of('wrapped');

    it('emits mark job as succeeded action', (done) => {
      const expectedEvents = [
        markJobAsStarted('jobId'),
        'mapped',
        markJobAsSucceeded('jobId', 'wrapped'),
        removeJob('jobId'),
      ]

      const result$ = call(wrapped$, map(() => 'mapped'));
      result$.subscribe(actions => {
        expect(actions).toEqual(expectedEvents);
        done();
      });
    });
  });

  describe('when wrapped observable fails with response', () => {
    const errors = [{ title: 'error' }];
    const error = { response: { errors } };
    const wrapped$ = throwError(error);

    it('emits mark job as failed action', (done) => {
      const expectedEvents = [
        markJobAsStarted('jobId'),
        markJobAsFailed('jobId', errors),
        removeJob('jobId'),
      ]

      const result$ = call(wrapped$, map(() => 'mapped'));
      result$.subscribe(actions => {
        expect(actions).toEqual(expectedEvents);
        done();
      });
    });
  });

  describe('when wrapped observable fails with empty response', () => {
    const error = { response: null };
    const wrapped$ = throwError(error);

    it('emits mark job as failed action', (done) => {
      const expectedEvents = [
        markJobAsStarted('jobId'),
        markJobAsFailed('jobId', []),
        removeJob('jobId'),
      ]

      const result$ = call(wrapped$, map(() => 'mapped'));
      result$.subscribe(actions => {
        expect(actions).toEqual(expectedEvents);
        done();
      });
    });
  });
});
