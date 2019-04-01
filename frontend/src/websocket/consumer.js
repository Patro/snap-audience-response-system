import ActionCable from 'actioncable';

const consumer = {
  createSubscription(interactiveSessionId, { received }) {
    const internal = internalConsumer.subscriptions.create({
      channel,
      id: interactiveSessionId,
    }, { received });
    return { unsubscribe: internal.unsubscribe };
  },
};

export default consumer;

///////////////////////////////////////////////////////////////////////////////

const channel = 'ApplicationCable::InteractiveSessionChannel';
const internalConsumer = ActionCable.createConsumer();
