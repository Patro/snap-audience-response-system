import { of, concat } from 'rxjs';
import { mergeMap, catchError, endWith } from 'rxjs/operators';
import get from 'lodash/get';
import {
  markJobAsStarted, markJobAsSucceeded, markJobAsFailed, removeJob
} from '../actions';

const withJob = (trigger, wrapped$, onSuccess) => (
  concat(
    of(markJobAsStarted(trigger.jobId, trigger)),
    wrapped$.pipe(
      mergeMap(result => concat(
        of(result).pipe(onSuccess),
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
