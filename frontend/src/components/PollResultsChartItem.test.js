import React from 'react';
import { Progress } from 'antd';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PollResultsChartItem from './PollResultsChartItem';

class TestWrapper extends AbstractTestWrapper {
  get optionText() {
    return this.wrapper.find('.poll_results_chart_item__option_text').text();
  }

  get progress() {
    return this.wrapper.find(Progress).first();
  }

  get givenPercent() {
    return this.progress.prop('percent');
  }

  _render() {
    return shallow(
      <PollResultsChartItem {...this.props} />
    )
  }
}

describe('PollResultsChartItem', () => {
  let poll, questionOptionCount, component;

  beforeEach(() => {
    poll = factories.poll.entity({ attributes: { numberOfRespondents: 100 }});
    questionOptionCount = factories.questionOptionCount.entity({
      attributes: { numberOfResponses: 10 },
      relationships: {
        poll: { id: poll.id, type: poll.type },
        questionOption: factories.questionOption.identifier({ id: 400 }),
      },
    });
    component = new TestWrapper({ props: { poll, questionOptionCount }});
  });

  describe('given questionOption', () => {
    beforeEach(() => {
      const questionOption = factories.questionOption.entity({
        id: 400,
        attributes: { text: '42' },
        relationships: { question: poll.relationships.question },
      });
      component.props.questionOption = questionOption;
    });

    it('renders option text', () => {
      expect(component.optionText).toEqual('42');
    });

    it('sets percentage of option', () => {
      expect(component.givenPercent).toEqual(10);
    });
  });

  describe('without questionOption', () => {
    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    })
  });
});
