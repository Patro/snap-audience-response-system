import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import factories from '../../__factories__';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import AttendeeScreen from '../components/AttendeeScreen';
import AttendeeScreenContainer from './AttendeeScreenContainer';

const session = factories.interactiveSession.entity({ id: 100 });
const collection = factories.poll.collectionWithIds([100]);
const poll = factories.poll.entity({ id: 100 });

const filter = '{"interactiveSessionId":100,"status":"open","responded":false}'
const filledStore = {
  entities: {
    INTERACTIVE_SESSION: { 100: session },
    POLL: { 100: poll },
  },
  collections: {
    POLL: { [filter]: collection },
  },
};

const setupStore = (initial) => ( configureStore()(initial) );
const mountContainer = ({ store, session } = {}) => (
  mount(
    <Provider store={store}>
      <AttendeeScreenContainer interactiveSession={session} />
    </Provider>
  )
);

describe('AttendeeScreenContainer', () => {
  describe('given filled store', () => {
    const store = setupStore(filledStore);

    it('passes first poll to component', () => {
      const wrapper = mountContainer({ store, session });
      const wrapped = wrapper.find(AttendeeScreen);

      expect(wrapped.props().unrespondedPoll).toEqual(poll);
    });
  });

  describe('given empty store', () => {
    const store = setupStore({});

    it('passes undefined as poll to component', () => {
      const wrapper = mountContainer({ store, session });
      const wrapped = wrapper.find(AttendeeScreen);

      expect(wrapped.props().unrespondedPoll).toBeUndefined();
    });
  });

  it('dispatches fetch collection action on refresh', () => {
    const store = setupStore({});

    const wrapper = mountContainer({ store, session });
    const wrapped = wrapper.find(AttendeeScreen);
    wrapped.props().onRefresh();

    const action = store.getActions().slice(-1)[0];
    const expectedAction = fetchCollection(POLL, {
      interactiveSessionId: 100,
      status: 'open',
      responded: false
    });
    expect(action).toMatchObject(expectedAction);
  });
});
