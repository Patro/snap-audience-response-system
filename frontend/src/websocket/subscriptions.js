import {
  POLL_CREATED, POLL_DESTROYED, POLL_UPDATED, RESPONSE_CREATED,
} from '../constants/eventTypes';
import consumer from './consumer';

const subscriptions = {
  subscribeForEvents(interactiveSessionId, types, onEvent) {
    return consumer.createSubscription(interactiveSessionId, {
      received: (data) => {
        const event = data.event;
        if (event === undefined) { return; }
        if (types.indexOf(event.type) === -1) { return; }
        onEvent(event);
      },
    });
  },
  subscribeForPollEvents(interactiveSessionId, onEvent) {
    return this.subscribeForEvents(
      interactiveSessionId,
      pollEventTypes,
      event => onEvent({ type: event.type, pollId: event.poll_id })
    )
  },
  subscribeForResponseEvents(interactiveSessionId, pollId, onEvent) {
    return this.subscribeForEvents(
      interactiveSessionId,
      responseEventTypes,
      event => {
        if (event.poll_id === pollId) {
          onEvent({
            type: event.type,
            pollId: event.poll_id,
            responseId: event.response_id,
          });
        }
      }
    )
  },
};

export default subscriptions;

///////////////////////////////////////////////////////////////////////////////

const pollEventTypes = [POLL_CREATED, POLL_DESTROYED, POLL_UPDATED];
const responseEventTypes = [RESPONSE_CREATED];
