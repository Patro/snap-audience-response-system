import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import { fetchCollection } from '../actions';
import { POLL, QUESTION } from '../constants/entityTypes';
import QuestionList from '../components/QuestionList';
import QuestionListContainer from './QuestionListContainer';

class TestWrapper extends AbstractTestWrapper {
  get list() {
    return this.wrapper.find(QuestionList);
  }

  get givenQuestions() {
    return this.list.prop('questions');
  }

  get givenOpenPollsByQuestionId() {
    return this.list.prop('openPollsByQuestionId');
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

  describe('questions', () => {
    describe('given filled store', () => {
      let questionA, questionB;

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

      it('passes questions from store to component', () => {
        expect(component.givenQuestions).toEqual([questionA, questionB]);
      });
    });

    describe('given empty store', () => {
      beforeEach(() => {
        component.store = {};
      });

      it('passes undefined to component', () => {
        expect(component.givenQuestions).toBeUndefined();
      });
    });
  });

  describe('open polls by question id', () => {
    describe('given filled store', () => {
      let pollA, pollB;

      beforeEach(() => {
        let questionA = factories.singleChoiceQuestion.identifier({ id: 913 });
        pollA = factories.poll.entity({
          id: 1001,
          relationships: { question: questionA },
        });
        let questionB = factories.singleChoiceQuestion.identifier({ id: 914 });
        pollB = factories.poll.entity({
          id: 1002,
          relationships: { question: questionB },
        });
        const pollCollection = factories.collection.withEntities([
          pollA, pollB
        ]);

        component.store = {
          entities: {
            POLL: { 1001: pollA, 1002: pollB },
          },
          collections: {
            POLL: {
              '{"interactiveSessionId":100,"status":"open"}': pollCollection,
            },
          },
        };
      });

      it('passes open polls to component', () => {
        expect(component.givenOpenPollsByQuestionId).toEqual({
          913: pollA,
          914: pollB,
        });
      });
    });

    describe('given empty store', () => {
      beforeEach(() => {
        component.store = {};
      });

      it('passes undefined to component', () => {
        expect(component.givenOpenPollsByQuestionId).toBeUndefined();
      });
    });
  });

  describe('on refresh', () => {
    it('dispatches fetch collection action for questions', () => {
      component.refresh();

      const actions = component.store.getActions();
      const expectedAction = fetchCollection(QUESTION, {
        interactiveSessionId: 100,
      }, expect.anything());
      expect(actions).toContainEqual(expectedAction);
    });

    it('dispatches fetch collection action for open polls', () => {
      component.refresh();

      const actions = component.store.getActions();
      const expectedAction = fetchCollection(POLL, {
        interactiveSessionId: 100,
        status: 'open',
      }, expect.anything());
      expect(actions).toContainEqual(expectedAction);
    });
  });
});
