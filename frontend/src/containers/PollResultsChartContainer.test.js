import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { fetchCollection, fetchEntity } from '../actions';
import {
  POLL, QUESTION_OPTION_COUNT, SINGLE_CHOICE_QUESTION,
} from '../constants/entityTypes';
import PollResultsChart from '../components/PollResultsChart';
import PollResultsChartContainer from './PollResultsChartContainer';

class TestWrapper extends AbstractTestWrapper {
  get chart() {
    return this.wrapper.find(PollResultsChart);
  }

  get givenPoll() {
    return this.chart.prop('poll');
  }

  get givenQuestion() {
    return this.chart.prop('question');
  }

  get givenQuestionOptionCounts() {
    return this.chart.prop('questionOptionCounts');
  }

  _render() {
    return mount(this._addStoreProvider(
      <PollResultsChartContainer {...this.props} />
    ))
  }

  refresh() {
    this.chart.props().onRefresh();
  }
}

describe('PollResultsChartContainer', () => {
  let poll, component;

  beforeEach(() => {
    poll = factories.poll.entity({ id: '400', relationships: {
      question: factories.singleChoiceQuestion.identifier({ id: '600' }),
    }});
    component = new TestWrapper({ props: { poll }});
  });

  describe('given filled store', () => {
    let question, countA, countB;

    beforeEach(() => {
      question = factories.singleChoiceQuestion.entity({ id: '600' });
      countA = factories.questionOptionCount.entity({ id: '30', relationships: {
        poll: { id: poll.get('id'), type: poll.get('type') },
      }});
      countB = factories.questionOptionCount.entity({ id: '31', relationships: {
        poll: { id: poll.get('id'), type: poll.get('type') },
      }});
      const collection = factories.collection.withEntities([countA, countB])
        .merge(Immutable.fromJS({
          type: QUESTION_OPTION_COUNT,
          filterParams: { pollId: '400' }
        }));

      component.store = buildTestState({
        entities: [ question, countA, countB ],
        collections: [ collection ],
      });
    });

    it('passes question to component', () => {
      expect(component.givenQuestion).toEqual(question);
    });

    it('passes question option counts to component', () => {
      expect(component.givenQuestionOptionCounts).toEqual(
        Immutable.List([countA, countB])
      );
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = Immutable.Map();
    });

    it('passes undefined as question to component', () => {
      expect(component.givenQuestion).toBeUndefined();
    });

    it('passes undefined as question option counts to component', () => {
      expect(component.givenQuestionOptionCounts).toBeUndefined();
    });
  });

  describe('on refresh', () => {
    beforeEach(() => {
      const poll = factories.poll.entity({ id: '400', relationships: {
        question: factories.singleChoiceQuestion.identifier({ id: '600' }),
      }});

      component.store = buildTestState({
        entities: [ poll ],
      });
    });

    it('dispatches fetch entity action for question', () => {
      component.refresh();

      const actions = component.store.getActions();
      const expectedAction = fetchEntity(
        SINGLE_CHOICE_QUESTION, '600', expect.anything()
      );
      expect(actions).toContainEqual(expectedAction);
    });

    it('dispatches fetch entity action for poll', () => {
      component.refresh();

      const actions = component.store.getActions();
      const expectedAction = fetchEntity(POLL, '400', expect.anything());
      expect(actions).toContainEqual(expectedAction);
    });

    it('dispatches fetch collection action for question option counts', () => {
      component.refresh();

      const actions = component.store.getActions();
      const expectedAction = fetchCollection(QUESTION_OPTION_COUNT, {
        pollId: '400',
      }, expect.anything());
      expect(actions).toContainEqual(expectedAction);
    });
  });
});
