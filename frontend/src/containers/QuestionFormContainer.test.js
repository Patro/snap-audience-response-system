import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { fetchCollection, fetchEntity, saveQuestion } from '../actions';
import {
  QUESTION_OPTION,
  SINGLE_CHOICE_QUESTION,
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
    this.form.props().onSubmit(Immutable.fromJS({ question, options }));
  }
}

describe('QuestionFormContainer', () => {
  let component;

  beforeEach(() => {
    const interactiveSession = factories.interactiveSession.entity();
    component = new TestWrapper({ props: { interactiveSession }});
  });

  describe('with question type and id', () => {
    beforeEach(() => {
      component.props.match = {
        params: {
          questionId: '123',
          questionType: 'single_choice',
        },
      };
    });

    describe('given store with question and options', () => {
      let question, optionA, optionB;

      beforeEach(() => {
        question = factories.singleChoiceQuestion.entity({ id: '123' });
        optionA = factories.questionOption.entity({ id: '426' });
        optionB = factories.questionOption.entity({ id: '429' });
        const optionCollection = factories.questionOption.collectionWithIds([
          '426', '429',
        ]).merge({
          filterParams: Immutable.fromJS({ questionId: '123' }),
        });

        component.store = buildTestState({
          entities: [question, optionA, optionB],
          collections: [optionCollection],
        });
      });

      it('passes question to component', () => {
        expect(component.givenQuestion).toEqual(question);
      });

      it('passes options to component', () => {
        expect(component.givenOptions).toEqual(
          Immutable.List([optionA, optionB])
        );
      });
    });

    describe('given store with job', () => {
      let question, optionA, optionB, job;

      beforeEach(() => {
        question = factories.singleChoiceQuestion.entity({ id: '123' });
        optionA = factories.questionOption.entity({ id: '426' });
        optionB = factories.questionOption.entity({ id: '429' });
        job = factories.job.started({
          id: 'saveQuestionJob',
          trigger: {
            question: question,
            options: [optionA, optionB],
          },
        });

        component.store = buildTestState({ jobs: [job] });
      });

      it('passes question to component', () => {
        expect(component.givenQuestion).toEqual(question);
      });

      it('passes options to component', () => {
        expect(component.givenOptions).toEqual(
          Immutable.List([optionA, optionB])
        );
      });

      it('passes job to component', () => {
        expect(component.givenJob).toEqual(job);
      });
    });

    describe('given empty store', () => {
      beforeEach(() => {
        component.store = Immutable.Map();
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
        const expectedAction = fetchEntity(
          SINGLE_CHOICE_QUESTION, '123', expect.anything(),
        );
        expect(actions).toContainEqual(expectedAction);
      });

      it('dispatches fetch collection action', () => {
        component.refresh();

        const actions = component.store.getActions();
        const expectedAction = fetchCollection(QUESTION_OPTION, {
          questionId: '123',
        }, expect.anything());
        expect(actions).toContainEqual(expectedAction);
      });
    });

    describe('on submit', () => {
      it('dispatches save question with options action on submit', () => {
        const question = factories.singleChoiceQuestion.entity({ id: '123' });
        const optionA = factories.questionOption.entity({ id: '426' });
        const optionB = factories.questionOption.entity({ id: '429' });

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
        const expectedAction = fetchEntity(
          SINGLE_CHOICE_QUESTION, '123', expect.anything()
        );
        expect(actions).not.toContainEqual(expectedAction);
      });

      it('does not dispatch fetch collection action', () => {
        component.refresh();

        const actions = component.store.getActions();
        const expectedAction = fetchCollection(QUESTION_OPTION, {
          questionId: '123',
        }, expect.anything());
        expect(actions).not.toContainEqual(expectedAction);
      });
    });
  });
});
