import { of, zip, merge } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { RESPOND_TO_POLL, receiveEntity } from '../actions';
import { RESPONSE, QUESTION_OPTION } from '../constants/entityTypes'
import withJob from './withJob';

const respondToPollEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === RESPOND_TO_POLL),
  mergeMap(action => processAction(action, dependencies))
);

export default respondToPollEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction = (action, dependencies) => (
  withJob(
    action,
    createResponses$(action, dependencies),
    mergeMap(options => merge(
      ...options.map(option => of(receiveEntity(option)))
    ))
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
