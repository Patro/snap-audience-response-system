import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import factories from '../../__factories__';
import { fetchCollection, fetchEntity, createEntity } from '../actions';
import {
  QUESTION_OPTION, RESPONSE, SINGLE_CHOICE_QUESTION
} from './../constants/entityTypes';
import RespondForm from '../components/RespondForm';
import RespondFormContainer from './RespondFormContainer';

const question = factories.singleChoiceQuestion.entity({ id: 123 });
const optionA = factories.questionOption.entity({ id: 426 });
const optionB = factories.questionOption.entity({ id: 429 });
const optionCollection = factories.questionOption.collectionWithIds([
  426, 429
]);
const poll = factories.poll.entity({
  relationships: {
    question: factories.singleChoiceQuestion.identifier(question),
  },
});

const filledStore = {
  entities: {
    POLL: { 923: poll },
    SINGLE_CHOICE_QUESTION: { 123: question },
    QUESTION_OPTION: { 426: optionA, 429: optionB },
  },
  collections: {
    QUESTION_OPTION: { '{"questionId":123}': optionCollection },
  },
};

const setupStore = (initial) => ( configureStore()(initial) );
const mountContainer = ({ store, poll } = {}) => (
  mount(
    <Provider store={store}>
      <RespondFormContainer poll={poll} />
    </Provider>
  )
);
const getForm = (wrapper) => (
  wrapper.find(RespondForm)
);

describe('RespondFormContainer', () => {
  describe('given filled store', () => {
    const store = setupStore(filledStore);

    it('passes question to component', () => {
      const wrapper = mountContainer({ store, poll });
      const wrapped = getForm(wrapper);

      expect(wrapped.props().question).toEqual(question);
    });

    it('passes options to component', () => {
      const wrapper = mountContainer({ store, poll });
      const wrapped = getForm(wrapper);

      expect(wrapped.props().options).toEqual([optionA, optionB]);
    });
  });

  describe('given empty store', () => {
    const store = setupStore({});

    it('passes undefined as question to component', () => {
      const wrapper = mountContainer({ store, poll });
      const wrapped = getForm(wrapper);

      expect(wrapped.props().question).toBeUndefined();
    });

    it('passes undefined as options to component', () => {
      const wrapper = mountContainer({ store, poll });
      const wrapped = getForm(wrapper);

      expect(wrapped.props().options).toBeUndefined();
    });
  });

  it('dispatches fetch entity action on refresh', () => {
    const store = setupStore();

    const wrapper = mountContainer({ store, poll });
    const wrapped = getForm(wrapper);
    wrapped.props().onRefresh();

    const actions = store.getActions();
    const expectedAction = fetchEntity(SINGLE_CHOICE_QUESTION, 123);
    expect(actions).toContainEqual(expectedAction);
  });

  it('dispatches fetch collection action on refresh', () => {
    const store = setupStore();

    const wrapper = mountContainer({ store, poll });
    const wrapped = getForm(wrapper);
    wrapped.props().onRefresh();

    const actions = store.getActions();
    const expectedAction = fetchCollection(QUESTION_OPTION, {
      questionId: 123,
    });
    expect(actions).toContainEqual(expectedAction);
  });

  it('dispatches create entity action for given id on submit', () => {
    const store = setupStore();

    const wrapper = mountContainer({ store, poll });
    const wrapped = getForm(wrapper);
    wrapped.props().onSubmit([1]);

    const actions = store.getActions();
    const expectedAction = createEntity({
      type: RESPONSE,
      relationships: {
        poll: { id: poll.id, type: poll.type },
        pickedQuestionOption: { id: 1, type: QUESTION_OPTION },
      },
    });
    expect(actions).toContainEqual(expectedAction);
  });
});
