import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import factories from '../../__factories__';
import { fetchCollection } from '../actions';
import { QUESTION } from '../constants/entityTypes';
import QuestionList from '../components/QuestionList';
import QuestionListContainer from './QuestionListContainer';

const session = factories.interactiveSession.entity({ id: 100 });
const questionA = factories.singleChoiceQuestion.entity({ id: 913 });
const questionB = factories.multipleChoiceQuestion.entity({ id: 914 });
const questionCollection = factories.collection.withEntities([
  questionA, questionB
]);

const filledStore = {
  entities: {
    SINGLE_CHOICE_QUESTION: { 913: questionA },
    MULTIPLE_CHOICE_QUESTION: { 914: questionB },
  },
  collections: {
    QUESTION: { '{"interactiveSessionId":100}': questionCollection },
  },
};

const setupStore = (initial) => ( configureStore()(initial) );
const mountContainer = ({ store } = {}) => (
  mount(
    <Provider store={store}>
      <QuestionListContainer interactiveSession={session} />
    </Provider>
  )
);
const getComponent = (wrapper) => wrapper.find(QuestionList);

describe('QuestionListContainer', () => {
  describe('given filled store', () => {
    const store = setupStore(filledStore);

    it('passes questions to component', () => {
      const wrapper = mountContainer({ store });
      const wrapped = getComponent(wrapper);

      expect(wrapped.props().questions).toEqual([questionA, questionB]);
    });
  });

  describe('given empty store', () => {
    const store = setupStore({});

    it('passes undefined as questions to component', () => {
      const wrapper = mountContainer({ store });
      const wrapped = getComponent(wrapper);

      expect(wrapped.props().questions).toBeUndefined();
    });
  });

  it('dispatches fetch collection action on refresh', () => {
    const store = setupStore();

    const wrapper = mountContainer({ store });
    const wrapped = getComponent(wrapper);
    wrapped.props().onRefresh();

    const actions = store.getActions();
    const expectedAction = fetchCollection(QUESTION, {
      interactiveSessionId: 100,
    });
    expect(actions).toContainEqual(expectedAction);
  });
});
