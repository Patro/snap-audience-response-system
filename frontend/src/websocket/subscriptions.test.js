import { POLL_CREATED, RESPONSE_CREATED } from '../constants/eventTypes';
import consumer from './consumer';
import subscriptions from './subscriptions';

jest.mock('./consumer');

describe('subscriptions', () => {
  describe('subscribeForPollEvents', () => {
    describe('given poll event', () => {
      let data;

      beforeEach(() => {
        data = { event: { type: POLL_CREATED, poll_id: '200' } };
      });

      it('calls on event handler', () => {
        const onEvent = jest.fn();
        subscriptions.subscribeForPollEvents('100', onEvent);

        consumer._receiveData(data);

        const expectedEvent = { type: POLL_CREATED, pollId: '200' };
        expect(onEvent).toBeCalledWith(expectedEvent);
      });
    });

    describe('given non poll event', () => {
      let data;

      beforeEach(() => {
        data = { event: { type: 'OTHER_EVENT' } };
      });

      it('does not call on event handler', () => {
        const onEvent = jest.fn();
        subscriptions.subscribeForPollEvents('100', onEvent);

        consumer._receiveData(data);

        expect(onEvent).not.toBeCalled();
      });
    });

    describe('given empty data object', () => {
      let data;

      beforeEach(() => {
        data = {};
      });

      it('does not call on event handler', () => {
        const onEvent = jest.fn();
        subscriptions.subscribeForPollEvents('100', onEvent);

        consumer._receiveData(data);

        expect(onEvent).not.toBeCalled();
      });
    });
  });

  describe('subscribeForResponseEvents', () => {
    describe('given response event with matching poll id', () => {
      let data;

      beforeEach(() => {
        data = {
          event: { type: RESPONSE_CREATED, poll_id: '200', response_id: '300' },
        };
      });

      it('calls on event handler', () => {
        const onEvent = jest.fn();
        subscriptions.subscribeForResponseEvents('100', '200', onEvent);

        consumer._receiveData(data);

        const expectedEvent = {
          type: RESPONSE_CREATED, pollId: '200', responseId: '300',
        };
        expect(onEvent).toBeCalledWith(expectedEvent);
      });
    });

    describe('given response event with non matching poll id', () => {
      let data;

      beforeEach(() => {
        data = {
          event: { type: RESPONSE_CREATED, poll_id: '201', response_id: '300' },
        };
      });

      it('does not call on event handler', () => {
        const onEvent = jest.fn();
        subscriptions.subscribeForResponseEvents('100', '200', onEvent);

        consumer._receiveData(data);

        expect(onEvent).not.toBeCalled();
      });
    });

    describe('given non response event', () => {
      let data;

      beforeEach(() => {
        data = { event: { type: 'OTHER_EVENT' } };
      });

      it('does not call on event handler', () => {
        const onEvent = jest.fn();
        subscriptions.subscribeForResponseEvents('100', '200', onEvent);

        consumer._receiveData(data);

        expect(onEvent).not.toBeCalled();
      });
    });

    describe('given empty data object', () => {
      let data;

      beforeEach(() => {
        data = {};
      });

      it('does not call on event handler', () => {
        const onEvent = jest.fn();
        subscriptions.subscribeForResponseEvents('100', '200', onEvent);

        consumer._receiveData(data);

        expect(onEvent).not.toBeCalled();
      });
    });
  });
});
