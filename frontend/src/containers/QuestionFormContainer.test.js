import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import { fetchCollection, fetchEntity, saveQuestion } from '../actions';
import {
  QUESTION_OPTION,
  SINGLE_CHOICE_QUESTION
} from './../constants/entityTypes';
import QuestionForm from '../components/QuestionForm';
import QuestionFormContainer from './QuestionFormContainer';

class TestWrapper extends AbstractTestWrapper {
  get form() {
    return this.wrapper.find(QuestionForm);
  }

  get givenQuestion() {
    return this.form.prop('question');
  }

  get givenOptions() {
    return this.form.prop('options');
  }

  get givenJob() {
    return this.form.prop('saveJob');
  }

  _render() {
    return mount(this._addStoreProvider(
      <QuestionFormContainer {...this.props } />
    ));
  }

  refresh() {
    this.form.props().onRefresh();
  }

  submit(question, options) {
    this.form.props().onSubmit(question, options);
  }
}

describe('QuestionFormContainer', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('with question type and id', () => {
    beforeEach(() => {
      component.props.match = {
        params: {
          questionId: 123,
          questionType: 'single_choice',
        },
      };
    });

    describe('given filled store', () => {
      let question;
      let optionA;
      let optionB;
      let job;

      beforeEach(() => {
        question = factories.singleChoiceQuestion.entity({ id: 123 });
        optionA = factories.questionOption.entity({ id: 426 });
        optionB = factories.questionOption.entity({ id: 429 });
        const optionCollection = factories.questionOption.collectionWithIds([
          426, 429
        ]);
        job = factories.job.started({ id: 'saveQuestionJob' });

        component.store = {
          entities: {
            [SINGLE_CHOICE_QUESTION]: { 123: question },
            [QUESTION_OPTION]: { 426: optionA, 429: optionB },
          },
          collections: {
            [QUESTION_OPTION]: { '{"questionId":123}': optionCollection },
          },
          jobs: {
            'saveQuestionJob': job,
          },
        };
      });

      it('passes question to component', () => {
        expect(component.givenQuestion).toEqual(question);
      });

      it('passes options to component', () => {
        expect(component.givenOptions).toEqual([optionA, optionB]);
      });

      it('passes job to component', () => {
        expect(component.givenJob).toEqual(job);
      });
    });

    describe('given empty store', () => {
      beforeEach(() => {
        component.store = {};
      });

      it('passes undefined as question to component', () => {
        expect(component.givenQuestion).toBeUndefined();
      });

      it('passes undefined as options to component', () => {
        expect(component.givenOptions).toBeUndefined();
      });

      it('passes undefined as job to component', () => {
        expect(component.givenJob).toBeUndefined();
      });
    });

    describe('on refresh', () => {
      it('dispatches fetch entity action', () => {
        component.refresh();

        const actions = component.store.getActions();
        const expectedAction = fetchEntity(SINGLE_CHOICE_QUESTION, 123);
        expect(actions).toContainEqual(expectedAction);
      });

      it('dispatches fetch collection action', () => {
        component.refresh();

        const actions = component.store.getActions();
        const expectedAction = fetchCollection(QUESTION_OPTION, {
          questionId: 123,
        });
        expect(actions).toContainEqual(expectedAction);
      });
    });

    describe('on submit', () => {
      it('dispatches save question with options action on submit', () => {
        const question = factories.singleChoiceQuestion.entity({ id: 123 });
        const optionA = factories.questionOption.entity({ id: 426 });
        const optionB = factories.questionOption.entity({ id: 429 });

        component.submit(question, [optionA, optionB]);

        const actions = component.store.getActions();
        const expectedAction = saveQuestion(
          question, [optionA, optionB], 'saveQuestionJob'
        );
        expect(actions).toContainEqual(expectedAction);
      });
    });
  });

  describe('without question type and id', () => {
    beforeEach(() => {
      component.props.match = {
        params: {},
      };
    });

    it('passes undefined as question to component', () => {
      expect(component.givenQuestion).toBeUndefined();
    });

    it('passes undefined as options to component', () => {
      expect(component.givenOptions).toBeUndefined();
    });

    describe('on refresh', () => {
      it('does not dispatch fetch entity action', () => {
        component.refresh();

        const actions = component.store.getActions();
        const expectedAction = fetchEntity(SINGLE_CHOICE_QUESTION, 123);
        expect(actions).not.toContainEqual(expectedAction);
      });

      it('does not dispatch fetch collection action', () => {
        component.refresh();

        const actions = component.store.getActions();
        const expectedAction = fetchCollection(QUESTION_OPTION, {
          questionId: 123,
        });
        expect(actions).not.toContainEqual(expectedAction);
      });
    });
  });
});
