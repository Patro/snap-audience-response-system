import { merge, of } from 'rxjs';
import { mergeMap, catchError, endWith } from 'rxjs/operators';
import get from 'lodash/get';
import {
  markJobAsStarted, markJobAsSucceeded, markJobAsFailed, removeJob
} from '../actions';

const withJob = (trigger, wrapped$, pipe) => (
  merge(
    of(markJobAsStarted(trigger.jobId, trigger)),
    wrapped$.pipe(
      mergeMap(result => merge(
        of(result).pipe(pipe),
        of(markJobAsSucceeded(trigger.jobId, result)),
      )),
      catchError((err) => {
        if (err.response === undefined) { throw err; }
        const errors = get(err, 'response.errors') || [];
        return of(markJobAsFailed(trigger.jobId, errors));
      }),
      endWith(removeJob(trigger.jobId)),
    )
  )
);

export default withJob;
