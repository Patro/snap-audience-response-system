import ActionCable from 'actioncable';

const consumer = {
  createSubscription(interactiveSessionId, { received }) {
    const internal = internalConsumer.subscriptions.create({
      channel,
      id: interactiveSessionId,
    }, { received });
    return { unsubscribe: internal.unsubscribe.bind(internal) };
  },
};

export default consumer;

///////////////////////////////////////////////////////////////////////////////

const channel = 'ApplicationCable::InteractiveSessionChannel';
const internalConsumer = ActionCable.createConsumer();
