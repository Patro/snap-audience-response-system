import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { FETCH_COLLECTION } from '../actions';
import { POLL } from '../constants/entityTypes';
import { getCollection, getEntity } from '../selectors';
import AttendeeScreen from '../components/AttendeeScreen';
import AttendeeScreenContainer from './AttendeeScreenContainer';

jest.mock('../selectors');

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
      mountContainer({ session: { id: 100 } });

      const expectedFilterParams = {
        interactiveSessionId: 100,
        status: 'open',
        responded: false,
      }
      expect(getCollection).toBeCalledWith({}, POLL, expectedFilterParams);
    });

    it('passes first poll to component', () => {
      const mockedCollection = { entities: [{ id: 100, type: POLL }] };
      getCollection.mockReturnValue(mockedCollection);

      const mockedPoll = { id: 100, type: POLL, attributes: {} };
      getEntity.mockReturnValue(mockedPoll);

      const wrapper = mountContainer({ session: { id: 100 } });
      const wrapped = wrapper.find(AttendeeScreen);

      expect(wrapped.props().unrespondedPoll).toEqual(mockedPoll);
    });
  });

  describe('refresh', () => {
    it('dispatches fetch collection action on refresh', () => {
      const store = setupStore();

      const wrapper = mountContainer({ store, session: { id: 100 } });
      const wrapped = wrapper.find(AttendeeScreen);
      wrapped.props().onRefresh();

      const action = store.getActions().slice(-1)[0];
      const expectedAction = {
        type: FETCH_COLLECTION,
        entityType: POLL,
        filterParams: {
          interactiveSessionId: 100,
          status: 'open',
          responded: false
        },
      };
      expect(action).toMatchObject(expectedAction);
    });
  });
});
