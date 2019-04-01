import React from 'react';
import { mount, shallow } from 'enzyme';
import { Alert } from 'antd';
import factories from '../../__factories__';
import subscriptions from '../websocket/subscriptions';
import AttendeeScreen from './AttendeeScreen';
import RespondFormContainer from '../containers/RespondFormContainer';

const session = factories.interactiveSession.entity({ id: 100 });

jest.mock('../websocket/subscriptions');

describe('AttendeeScreen', () => {
  it('renders without crashing', () => {
    mount(<AttendeeScreen interactiveSession={session} />);
  });

  describe('without unresponded poll', () => {
    it('renders waiting info', () => {
      const wrapper = shallow(<AttendeeScreen interactiveSession={session} />);
      const alert = wrapper.find(Alert).render();
      expect(alert.text()).toContain('Waiting');
    });
  });

  describe('given unresponded poll', () => {
    const poll = factories.poll.entity();

    it('renders respond form container', () => {
      const wrapper = shallow(
        <AttendeeScreen interactiveSession={session} unrespondedPoll={poll} />
      );
      const form = wrapper.find(RespondFormContainer);
      expect(form.length).toBe(1);
    });

    describe('when user responded to poll', () => {
      const simulateResponse = (wrapper) => {
        const form = wrapper.find(RespondFormContainer);
        form.simulate('success');
      };

      it('shows thank you message', () => {
        const wrapper = shallow(
          <AttendeeScreen interactiveSession={session} unrespondedPoll={poll} />
        )
        simulateResponse(wrapper);

        const alert = wrapper.find(Alert).render();
        expect(alert.text()).toContain('Thank you');
      });

      it('calls on refresh handler', () => {
        const refreshHandler = jest.fn();

        const wrapper = shallow(
          <AttendeeScreen
            interactiveSession={session}
            unrespondedPoll={poll}
            onRefresh={refreshHandler} />
        );
        simulateResponse(wrapper);

        expect(refreshHandler).toBeCalled();
      });
    });
  });

  describe('on mount', () => {
    it('calls on refresh handler', () => {
      const refreshHandler = jest.fn();
      shallow(
        <AttendeeScreen interactiveSession={session} onRefresh={refreshHandler} />
      );

      expect(refreshHandler).toBeCalled();
    });

    it('subscribes for poll events', () => {
      shallow(<AttendeeScreen interactiveSession={session} />);

      expect(subscriptions.subscribeForPollEvents).toBeCalled();
    });
  });

  describe('on poll event', () => {
    describe('without unresponded poll', () => {
      it('calls on refresh handler', () => {
        let onEventHandler;
        subscriptions.subscribeForPollEvents.mockImplementation((_, onEvent) => {
          onEventHandler = onEvent
        });

        const refreshHandler = jest.fn();
        shallow(
          <AttendeeScreen
            interactiveSession={session}
            onRefresh={refreshHandler} />
        );
        refreshHandler.mockClear();

        onEventHandler(factories.event.pollCreated())

        expect(refreshHandler).toBeCalled();
      });
    });

    describe('given unresponded poll with same id', () => {
      const poll = factories.poll.entity({ id: '300' });

      it('does call refresh handler', () => {
        let onEventHandler;
        subscriptions.subscribeForPollEvents.mockImplementation((_, onEvent) => {
          onEventHandler = onEvent
        });

        const refreshHandler = jest.fn();
        shallow(
          <AttendeeScreen
            interactiveSession={session}
            unrespondedPoll={poll}
            onRefresh={refreshHandler} />
        );
        refreshHandler.mockClear();

        onEventHandler(factories.event.pollCreated({ pollId: '300'}))

        expect(refreshHandler).toBeCalled();
      });
    });

    describe('given unresponded poll with different id', () => {
      const poll = factories.poll.entity({ id: '200' });

      it('does not call refresh handler', () => {
        let onEventHandler;
        subscriptions.subscribeForPollEvents.mockImplementation((_, onEvent) => {
          onEventHandler = onEvent
        });

        const refreshHandler = jest.fn();
        shallow(
          <AttendeeScreen
            interactiveSession={session}
            unrespondedPoll={poll}
            onRefresh={refreshHandler} />
        );
        refreshHandler.mockClear();

        onEventHandler(factories.event.pollCreated({ pollId: '300'}))

        expect(refreshHandler).not.toBeCalled();
      });
    });
  });

  describe('on unmount', () => {
    it('unsubscribes for poll events', () => {
      const subscription = { unsubscribe: jest.fn() };
      subscriptions.subscribeForPollEvents.mockReturnValue(
        subscription
      );

      const wrapper = shallow(<AttendeeScreen interactiveSession={session} />);
      wrapper.unmount();

      expect(subscription.unsubscribe).toBeCalled();
    });
  });
});
