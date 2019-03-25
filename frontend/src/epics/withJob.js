import { merge, of } from 'rxjs';
import { mergeMap, catchError, endWith } from 'rxjs/operators';
import get from 'lodash/get';
import {
  markJobAsStarted, markJobAsSucceeded, markJobAsFailed, removeJob
} from '../actions';

const withJob = (jobId, wrapped$, pipe) => (
  merge(
    of(markJobAsStarted(jobId)),
    wrapped$.pipe(
      mergeMap(result => merge(
        of(result).pipe(pipe),
        of(markJobAsSucceeded(jobId, result)),
      )),
      catchError((err) => {
        if (err.response === undefined) { throw err; }
        const errors = get(err, 'response.errors') || [];
        return of(markJobAsFailed(jobId, errors));
      }),
      endWith(removeJob(jobId)),
    )
  )
);

export default withJob;
