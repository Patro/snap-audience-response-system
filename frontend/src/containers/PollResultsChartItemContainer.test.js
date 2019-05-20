import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { fetchEntity } from '../actions';
import { QUESTION_OPTION } from '../constants/entityTypes';
import PollResultsChartItem from '../components/PollResultsChartItem';
import PollResultsChartItemContainer from './PollResultsChartItemContainer';

class TestWrapper extends AbstractTestWrapper {
  get item() {
    return this.wrapper.find(PollResultsChartItem);
  }

  get givenQuestionOption() {
    return this.item.prop('questionOption');
  }

  _render() {
    return mount(this._addStoreProvider(
      <PollResultsChartItemContainer {...this.props} />
    ))
  }

  refresh() {
    this.item.props().onRefresh();
  }
}

describe('PollResultsChartItemContainer', () => {
  let questionOptionCount, component;

  beforeEach(() => {
    const poll = factories.poll.entity();
    questionOptionCount = factories.questionOptionCount.entity({
      relationships: {
        questionOption: factories.questionOption.identifier({ id: '300' }),
      },
    });
    component = new TestWrapper({ props: { poll, questionOptionCount }});
  });

  describe('given filled store', () => {
    let questionOption;

    beforeEach(() => {
      questionOption = factories.questionOption.entity({ id: '300' });
      component.store = buildTestState({ entities: [questionOption] });
    });

    it('passes question option to component', () => {
      expect(component.givenQuestionOption).toEqual(questionOption);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = Immutable.Map();
    });

    it('passes undefined as question option to component', () => {
      expect(component.givenQuestionOption).toBeUndefined();
    });
  });

  describe('on refresh', () => {
    it('dispatches fetch entity action', () => {
      component.refresh();

      const actions = component.store.getActions();
      const expectedAction = fetchEntity(
        QUESTION_OPTION, '300', expect.anything()
      );
      expect(actions).toContainEqual(expectedAction);
    });
  });
});
