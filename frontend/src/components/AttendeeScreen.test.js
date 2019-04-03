import React from 'react';
import { shallow } from 'enzyme';
import { Alert } from 'antd';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import subscriptions from '../websocket/subscriptions';
import AttendeeScreen from './AttendeeScreen';
import RespondFormContainer from '../containers/RespondFormContainer';

jest.mock('../websocket/subscriptions', () => {
  let _onEvent;
  return {
    subscribeForPollEvents: jest.fn((_, onEvent) => {
      _onEvent = onEvent;
    }),
    _publishPollEvent: (event) => {
      _onEvent(event);
    }
  };
});

class TestWrapper extends AbstractTestWrapper {
  get alert() {
    return this.wrapper.find(Alert).first();
  }

  get alertText() {
    return this.alert.render().text();
  }

  get respondFormContainer() {
    return this.wrapper.find(RespondFormContainer).first();
  }

  _render() {
    return shallow(
      <AttendeeScreen {...this.props} />
    );
  }

  respond() {
    this.respondFormContainer.simulate('success');
  }
}

describe('AttendeeScreen', () => {
  let component;

  beforeEach(() => {
    const session = factories.interactiveSession.entity({ id: 100 });
    component = new TestWrapper({ props: {
      interactiveSession: session,
    } });
  });

  describe('without unresponded poll', () => {
    it('renders waiting info', () => {
      expect(component.alertText).toContain('Waiting');
    });
  });

  describe('given unresponded poll', () => {
    beforeEach(() => {
      component.props.unrespondedPoll = factories.poll.entity();
    });

    it('renders respond form container', () => {
      expect(component.respondFormContainer).toHaveLength(1);
    });

    describe('when user responded to poll', () => {
      it('shows thank you message', () => {
        component.respond();

        expect(component.alertText).toContain('Thank you');
      });

      it('calls on refresh handler', () => {
        const refreshHandler = jest.fn();
        component.props.onRefresh = refreshHandler;

        component.respond();

        expect(refreshHandler).toBeCalled();
      });
    });
  });

  describe('on mount', () => {
    it('calls on refresh handler', () => {
      const refreshHandler = jest.fn();
      component.props.onRefresh = refreshHandler;

      component._render();

      expect(refreshHandler).toBeCalled();
    });

    it('subscribes for poll events', () => {
      component._render();

      expect(subscriptions.subscribeForPollEvents).toBeCalled();
    });
  });

  describe('on poll event', () => {
    describe('without unresponded poll', () => {
      it('calls on refresh handler', () => {
        const refreshHandler = jest.fn();
        component.props.onRefresh = refreshHandler;

        component._render();
        refreshHandler.mockClear();
        subscriptions._publishPollEvent(factories.event.pollCreated())

        expect(refreshHandler).toBeCalled();
      });
    });

    describe('given unresponded poll with same id', () => {
      beforeEach(() => {
        component.props.unrespondedPoll = factories.poll.entity({ id: '300' });
      });

      it('calls refresh handler', () => {
        const refreshHandler = jest.fn();
        component.props.onRefresh = refreshHandler;

        component._render();
        refreshHandler.mockClear();
        subscriptions._publishPollEvent(
          factories.event.pollCreated({ pollId: '300' })
        );

        expect(refreshHandler).toBeCalled();
      });
    });

    describe('given unresponded poll with different id', () => {
      beforeEach(() => {
        component.props.unrespondedPoll = factories.poll.entity({ id: '200' });
      });

      it('does not call refresh handler', () => {
        const refreshHandler = jest.fn();
        component.props.onRefresh = refreshHandler;

        component._render();
        refreshHandler.mockClear();
        subscriptions._publishPollEvent(
          factories.event.pollCreated({ pollId: '300' })
        );

        expect(refreshHandler).not.toBeCalled();;
      });
    });
  });

  describe('on unmount', () => {
    it('unsubscribes for poll events', () => {
      const subscription = { unsubscribe: jest.fn() };
      subscriptions.subscribeForPollEvents.mockReturnValue(
        subscription
      );

      component.wrapper.unmount();

      expect(subscription.unsubscribe).toBeCalled();
    });
  });
});
