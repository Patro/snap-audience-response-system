import React from 'react';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PollResultsChartItem from './PollResultsChartItem';
import PollResultsChart from './PollResultsChart';

class TestWrapper extends AbstractTestWrapper {
  get questionText() {
    return this.wrapper.find('.poll_results_chart__question_text').text();
  }

  get items() {
    return this.wrapper.find(PollResultsChartItem);
  }

  _render() {
    return shallow(
      <PollResultsChart {...this.props} />
    )
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

      const questionOptionCounts = [
        factories.questionOptionCount.entity({ relationships: { poll }}),
        factories.questionOptionCount.entity({ relationships: { poll }}),
      ]
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
});
