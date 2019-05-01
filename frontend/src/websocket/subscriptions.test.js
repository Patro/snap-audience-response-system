import { POLL_CREATED } from '../constants/eventTypes';
import consumer from './consumer';
import subscriptions from './subscriptions';

jest.mock('./consumer');

const setupCreateSubscriptionMock = (createImpl) => {
  consumer.createSubscription.mockImplementation(createImpl);
};

describe('subscriptions', () => {
  describe('subscribeForPollEvents', () => {
    it('creates subscription for interactive session', () => {
      const createMock = jest.fn();
      setupCreateSubscriptionMock(createMock);

      subscriptions.subscribeForPollEvents('100', () => {});

      expect(createMock).toBeCalled();
    });

    describe('given data object with poll event', () => {
      const data = { event: { type: POLL_CREATED, poll_id: '200' } };

      it('calls on event handler', () => {
        const createImpl = (_, { received }) => received(data);
        setupCreateSubscriptionMock(createImpl);

        const onEvent = jest.fn();
        subscriptions.subscribeForPollEvents('100', onEvent);

        const expectedEvent = { type: POLL_CREATED, pollId: '200' };
        expect(onEvent).toBeCalledWith(expectedEvent);
      });
    });

    describe('given data object with non poll event', () => {
      const data = { event: { type: 'OTHER_EVENT' } };

      it('does not call on event handler', () => {
        const createImpl = (_, { received }) => received(data);
        setupCreateSubscriptionMock(createImpl);

        const onEvent = jest.fn();
        subscriptions.subscribeForPollEvents('100', onEvent);

        expect(onEvent).not.toBeCalled();
      });
    });

    describe('given empty data object', () => {
      const data = {};

      it('does not call on event handler', () => {
        const createImpl = (_, { received }) => received(data);
        setupCreateSubscriptionMock(createImpl);

        const onEvent = jest.fn();
        subscriptions.subscribeForPollEvents('100', onEvent);

        expect(onEvent).not.toBeCalled();
      });
    });
  });
});
