import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { FETCH_ENTITY } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import { getEntity } from '../selectors';
import SessionScreen from '../components/SessionScreen';
import SessionScreenContainer from './SessionScreenContainer';

jest.mock('../selectors');

const setupStore = () => ( configureStore()() );
const mountContainer = ({ store = setupStore(), sessionId = '100' } = {}) => (
  mount(
    <Provider store={store}>
      <SessionScreenContainer match={{ params: { id: sessionId } }}/>
    </Provider>
  )
);

describe('SessionScreenContainer', () => {
  describe('interactive session', () => {
    it('calls selector with session id', () => {
      mountContainer({ sessionId: '100' });

      expect(getEntity).toBeCalledWith({}, INTERACTIVE_SESSION, '100');
    });

    it('passes interactive session to component', () => {
      const mockedSession = { id: 100, type: INTERACTIVE_SESSION, attributes: {} };
      getEntity.mockReturnValue(mockedSession);

      const wrapper = mountContainer();
      const wrapped = wrapper.find(SessionScreen);

      expect(wrapped.props().interactiveSession).toEqual(mockedSession);
    });
  });

  describe('refresh', () => {
    it('dispatches fetch entity action on refresh', () => {
      const store = setupStore();

      const wrapper = mountContainer({ store, sessionId: '100' });
      const wrapped = wrapper.find(SessionScreen);
      wrapped.props().onRefresh();

      const action = store.getActions()[0];
      const expectedAction = {
        type: FETCH_ENTITY, entityType: INTERACTIVE_SESSION, entityId: '100'
      };
      expect(action).toMatchObject(expectedAction);
    });
  });
});
