import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import { fetchCollection, fetchEntity, respondToPoll } from '../actions';
import {
  POLL, QUESTION_OPTION, SINGLE_CHOICE_QUESTION,
} from './../constants/entityTypes';
import RespondForm from '../components/RespondForm';
import RespondFormContainer from './RespondFormContainer';


class TestWrapper extends AbstractTestWrapper {
  get form() {
    return this.wrapper.find(RespondForm);
  }

  get givenQuestion() {
    return this.form.prop('question');
  }

  get givenOptions() {
    return this.form.prop('options');
  }

  get givenJob() {
    return this.form.prop('respondJob');
  }

  _render() {
    return mount(this._addStoreProvider(
      <RespondFormContainer {...this.props } />
    ));
  }

  refresh() {
    this.form.props().onRefresh();
  }

  submit(optionIds) {
    this.form.props().onSubmit(optionIds);
  }
}

describe('RespondFormContainer', () => {
  let question, poll, component;

  beforeEach(() => {
    question = factories.singleChoiceQuestion.entity({ id: '123' });
    poll = factories.poll.entity({
      relationships: {
        question: factories.singleChoiceQuestion.identifier(question),
      },
    });
    component = new TestWrapper({ props: { poll: poll } });
  });

  describe('given filled store', () => {
    let optionA, optionB, job;

    beforeEach(() => {
      optionA = factories.questionOption.entity({ id: '426' });
      optionB = factories.questionOption.entity({ id: '429' });
      const optionCollection = factories.questionOption.collectionWithIds([
        '426', '429'
      ]);
      job = factories.job.started({ id: 'respondJob' });

      component.store = {
        entities: {
          [POLL]: { '923': poll },
          [SINGLE_CHOICE_QUESTION]: { '123': question },
          [QUESTION_OPTION]: { '426': optionA, '429': optionB },
        },
        collections: {
          [QUESTION_OPTION]: { '{"questionId":"123"}': optionCollection },
        },
        jobs: {
          'respondJob': job,
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

  it('dispatches fetch entity action on refresh', () => {
    component.refresh();

    const actions = component.store.getActions();
    const expectedAction = fetchEntity(
      SINGLE_CHOICE_QUESTION, '123', expect.anything()
    );
    expect(actions).toContainEqual(expectedAction);
  });

  it('dispatches fetch collection action on refresh', () => {
    component.refresh();

    const actions = component.store.getActions();
    const expectedAction = fetchCollection(QUESTION_OPTION, {
      questionId: '123',
    }, expect.anything());
    expect(actions).toContainEqual(expectedAction);
  });

  it('dispatches respond to poll action on submit', () => {
    component.submit(['1']);

    const actions = component.store.getActions();
    const expectedAction = respondToPoll(poll, ['1'], 'respondJob');
    expect(actions).toContainEqual(expectedAction);
  });
});
