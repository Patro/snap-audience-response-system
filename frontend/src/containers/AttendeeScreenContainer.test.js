import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import factories from '../../__factories__';
import { fetchCollection } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getCollection, getEntity } from '../selectors';
import AttendeeScreen from '../components/AttendeeScreen';
import AttendeeScreenContainer from './AttendeeScreenContainer';

jest.mock('../selectors');

const session = factories.interactiveSession.entity({ id: 100 });
const collection = factories.poll.collectionWithIds([100]);
const poll = factories.poll.entity({ id: 100 });

const setupStore = () => ( configureStore()() );
const mountContainer = ({ store = setupStore(), session } = {}) => (
  mount(
    <Provider store={store}>
      <AttendeeScreenContainer interactiveSession={session} />
    </Provider>
  )
);

describe('AttendeeScreenContainer', () => {
  describe('unresponded poll', () => {
    it('calls selector with filter params', () => {
      mountContainer({ session });

      const expectedFilterParams = {
        interactiveSessionId: 100,
        status: 'open',
        responded: false,
      }
      expect(getCollection).toBeCalledWith({}, POLL, expectedFilterParams);
    });

    it('passes first poll to component', () => {
      getCollection.mockReturnValue(collection);
      getEntity.mockReturnValue(poll);

      const wrapper = mountContainer({ session });
      const wrapped = wrapper.find(AttendeeScreen);

      expect(wrapped.props().unrespondedPoll).toEqual(poll);
    });
  });

  describe('refresh', () => {
    it('dispatches fetch collection action on refresh', () => {
      const store = setupStore();

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
});
