import Immutable from 'immutable';
import ActionCable from 'actioncable';

const consumer = {
  createSubscription(interactiveSessionId, { received }) {
    const internal = internalConsumer.subscriptions.create({
      channel,
      id: interactiveSessionId,
    }, {
      received: (data) => received(Immutable.fromJS(data)),
    });
    return { unsubscribe: internal.unsubscribe.bind(internal) };
  },
};

export default consumer;

///////////////////////////////////////////////////////////////////////////////

const channel = 'ApplicationCable::InteractiveSessionChannel';
const internalConsumer = ActionCable.createConsumer();
