import { concat } from 'rxjs';
import { of, zip } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { RESPOND_TO_POLL, receiveEntity } from '../actions';
import { RESPONSE, QUESTION_OPTION } from '../constants/entityTypes'
import reloadCollections from './reloadCollections';
import withJob from './withJob';

const respondToPollEpic = (action$, state$, dependencies) => action$.pipe(
  filter(action => action.type === RESPOND_TO_POLL),
  mergeMap(action => processAction$(action, state$, dependencies)),
);

export default respondToPollEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction$ = (action, state$, dependencies) => (
  withJob(
    action,
    createResponses$(action, dependencies),
    onSuccess(action, state$, dependencies),
  )
);

const createResponses$ = ({ poll, pickedOptionIds }, { api }) => (
  zip(
    ...pickedOptionIds.map(optionId => (
      createResponse$(poll, optionId, api)
    ))
  )
);

const createResponse$ = (poll, pickedOptionId, api) => (
  api.entities.create({
    type: RESPONSE,
    relationships: {
      poll: { id: poll.id, type: poll.type },
      pickedQuestionOption: { id: pickedOptionId, type: QUESTION_OPTION },
    }
  })
);

const onSuccess = (action, state$, dependencies) => (
  mergeMap(options =>
    concat(
      ...options.map(option => of(receiveEntity(option))),
      reloadCollections(state$, action.poll.type, dependencies),
    )
  )
);
