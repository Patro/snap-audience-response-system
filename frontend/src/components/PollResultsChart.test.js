import Immutable from 'immutable';
import React from 'react';
import { Card } from 'antd';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import subscriptions from '../websocket/subscriptions';
import PollResultsChartItemContainer
  from '../containers/PollResultsChartItemContainer';
import PollResultsChart from './PollResultsChart';

jest.mock('../websocket/subscriptions');

class TestWrapper extends AbstractTestWrapper {
  get card() {
    return this.wrapper.find(Card);
  }

  get cardTitle() {
    return this.card.prop('title');
  }

  get questionText() {
    return this.cardTitle;
  }

  get items() {
    return this.wrapper.find(PollResultsChartItemContainer);
  }

  _render() {
    return shallow(
      <PollResultsChart {...this.props} />
    )
  }

  setPoll(poll) {
    this.wrapper.setProps({ poll });
  }

  setQuestion(question) {
    this.wrapper.setProps({ question });
  }
}

describe('PollResultsChart', () => {
  let poll, component;

  beforeEach(() => {
    poll = factories.poll.entity({
      id: '100',
      relationships: { question: { id: '900' } }
    });
    component = new TestWrapper({ props: { poll } });
  });

  describe('given question and option counts', () => {
    beforeEach(() => {
      const question = factories.singleChoiceQuestion.entity({
        id: '900',
        attributes: { text: 'Question A' },
      });
      component.props.question = question;

      const questionOptionCounts = Immutable.List([
        factories.questionOptionCount.entity({ relationships: { poll }}),
        factories.questionOptionCount.entity({ relationships: { poll }}),
      ]);
      component.props.questionOptionCounts = questionOptionCounts;
    });

    it('renders question text', () => {
      expect(component.questionText).toEqual('Question A');
    });

    it('renders item for every option count', () => {
      expect(component.items).toHaveLength(2);
    });
  });

  describe('without question and option', () => {
    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    })
  });

  describe('subscription for response events', () => {
    describe('given question', () => {
      let question;

      beforeEach(() => {
        question = factories.singleChoiceQuestion.entity({
          relationships: {
            interactiveSession: factories.interactiveSession.identifier({
              id: '900',
            }),
          },
        });
        component.props.question = question;
      });

      it('subscribes for response events', () => {
        component._render();

        expect(subscriptions.subscribeForResponseEvents).toBeCalledWith(
          '900', '100', expect.anything(),
        );
      });

      describe('when poll is changed', () => {
        it('unsubscribes for response events', () => {
          const subscription = { unsubscribe: jest.fn() };
          subscriptions.subscribeForResponseEvents.mockReturnValue(
            subscription
          );

          component.setPoll(factories.poll.entity());

          expect(subscription.unsubscribe).toBeCalled();
        });

        it('subscribes for response events', () => {
          jest.useFakeTimers();
          let newPoll = factories.poll.entity({ id: '101' });
          component.setPoll(newPoll);

          jest.runAllTimers();
          expect(subscriptions.subscribeForResponseEvents).toBeCalledWith(
            '900', '101', expect.anything(),
          );
        });
      });

      describe('when question is changed', () => {
        it('unsubscribes for response events', () => {
          const subscription = { unsubscribe: jest.fn() };
          subscriptions.subscribeForResponseEvents.mockReturnValue(
            subscription
          );

          component.setQuestion(factories.multipleChoiceQuestion.entity());

          expect(subscription.unsubscribe).toBeCalled();
        });

        it('subscribes for response events', () => {
          jest.useFakeTimers();
          let newQuestion = factories.multipleChoiceQuestion.entity({
            relationships: {
              interactiveSession: factories.interactiveSession.identifier({
                id: '901',
              }),
            },
          });
          component.setQuestion(newQuestion);

          jest.runAllTimers();
          expect(subscriptions.subscribeForResponseEvents).toBeCalledWith(
            '901', '100', expect.anything(),
          );
        });
      });
    });

    describe('without question', () => {
      it('does not subscribe for response events', () => {
        component._render();

        expect(subscriptions.subscribeForResponseEvents).toBeCalled();
      })
    });
  });

  describe('on unmount', () => {
    describe('given question', () => {
      beforeEach(() => {
        component.props.question = factories.singleChoiceQuestion.entity();
      });

      it('unsubscribes for response events', () => {
        const subscription = { unsubscribe: jest.fn() };
        subscriptions.subscribeForResponseEvents.mockReturnValue(
          subscription
        );

        component.wrapper.unmount();

        expect(subscription.unsubscribe).toBeCalled();
      });
    });
  });
});
