import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import QuestionPollsScreen from '../components/QuestionPollsScreen';
import QuestionPollsScreenContainer from './QuestionPollsScreenContainer';

class TestWrapper extends AbstractTestWrapper {
  get screen() {
    return this.wrapper.find(QuestionPollsScreen);
  }

  get givenPolls() {
    return this.screen.prop('polls');
  }

  _render() {
    return mount(this._addStoreProvider(
      <QuestionPollsScreenContainer {...this.props} />
    ))
  }

  refresh() {
    this.screen.props().onRefresh();
  }
}

describe('QuestionPollsScreenContainer', () => {
  let question, component;

  beforeEach(() => {
    question = factories.singleChoiceQuestion.entity({ id: '100' });
    component = new TestWrapper({ props: { question }});
  });

  describe('given filled store', () => {
    let pollA, pollB;

    beforeEach(() => {
      pollA = factories.poll.entity({ id: '301', relationships: { question }});
      pollB = factories.poll.entity({ id: '302', relationships: { question }});
      const collection = factories.collection.withEntities([pollA, pollB]);

      component.store = buildTestState({
        entities: [pollA, pollB],
        collections: [
          factories.collection.withEntities([pollA, pollB]).merge({
            type: POLL,
            filterParams: Immutable.fromJS({ questionId: '100' }),
          })
        ],
      });
    });

    it('passes polls to component', () => {
      expect(component.givenPolls).toEqual(Immutable.fromJS([pollA, pollB]));
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = Immutable.Map();
    });

    it('passes undefined as polls to component', () => {
      expect(component.givenJoinJob).toBeUndefined();
    });
  });

  describe('on refresh', () => {
    it('dispatches fetch collection action', () => {
      component.refresh();

      const actions = component.store.getActions();
      const expectedAction = fetchCollection(POLL, {
        questionId: '100',
      }, expect.anything());
      expect(actions).toContainEqual(expectedAction);
    });
  });
});
