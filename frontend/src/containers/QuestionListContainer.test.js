import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import { fetchCollection } from '../actions';
import { QUESTION } from '../constants/entityTypes';
import QuestionList from '../components/QuestionList';
import QuestionListContainer from './QuestionListContainer';

class TestWrapper extends AbstractTestWrapper {
  get list() {
    return this.wrapper.find(QuestionList);
  }

  get givenQuestions() {
    return this.list.prop('questions');
  }

  _render() {
    return mount(this._addStoreProvider(this._addStaticRouter(
      <QuestionListContainer {...this.props} />
    )));
  }

  refresh() {
    this.list.props().onRefresh();
  }
}

describe('QuestionListContainer', () => {
  let component;

  beforeEach(() => {
    const session = factories.interactiveSession.entity({ id: 100 });
    component = new TestWrapper({ props: { interactiveSession: session } });
  });

  describe('given filled store', () => {
    let questionA;
    let questionB;

    beforeEach(() => {
      questionA = factories.singleChoiceQuestion.entity({ id: 913 });
      questionB = factories.multipleChoiceQuestion.entity({ id: 914 });
      const questionCollection = factories.collection.withEntities([
        questionA, questionB
      ]);

      component.store = {
        entities: {
          SINGLE_CHOICE_QUESTION: { 913: questionA },
          MULTIPLE_CHOICE_QUESTION: { 914: questionB },
        },
        collections: {
          QUESTION: { '{"interactiveSessionId":100}': questionCollection },
        },
      };
    });

    it('passes questions to component', () => {
      expect(component.givenQuestions).toEqual([questionA, questionB]);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = {};
    });

    it('passes undefined as questions to component', () => {
      expect(component.givenQuestions).toBeUndefined();
    });
  });

  it('dispatches fetch collection action on refresh', () => {
    component.refresh();

    const actions = component.store.getActions();
    const expectedAction = fetchCollection(QUESTION, {
      interactiveSessionId: 100,
    }, expect.anything());
    expect(actions).toContainEqual(expectedAction);
  });
});
