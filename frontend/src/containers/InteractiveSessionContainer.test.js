import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { FETCH_ENTITY } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import { getEntity } from '../selectors';
import InteractiveSession from '../components/InteractiveSession';
import InteractiveSessionContainer from './InteractiveSessionContainer';

jest.mock('../selectors');

const setupStore = () => ( configureStore()() );
const mountContainer = ({ store = setupStore(), sessionId = '100' } = {}) => (
  mount(
    <Provider store={store}>
      <InteractiveSessionContainer match={{ params: { id: sessionId } }}/>
    </Provider>
  )
);

describe('InteractiveSessionContainer', () => {
  describe('interactive session', () => {
    it('calls selector with session id', () => {
      mountContainer({ sessionId: '100' });

      expect(getEntity).toBeCalledWith({}, INTERACTIVE_SESSION, '100');
    });

    it('passes interactive session to component', () => {
      const mockedSession = { id: 100, type: INTERACTIVE_SESSION, attributes: {} };
      getEntity.mockReturnValue(mockedSession);

      const wrapper = mountContainer();
      const wrapped = wrapper.find(InteractiveSession);

      expect(wrapped.props().interactiveSession).toEqual(mockedSession);
    });
  });

  describe('refresh', () => {
    it('dispatches fetch entity action on refresh', () => {
      const store = setupStore();

      const wrapper = mountContainer({ store, sessionId: '100' });
      const wrapped = wrapper.find(InteractiveSession);
      wrapped.props().onRefresh();

      const action = store.getActions()[0];
      const expectedAction = {
        type: FETCH_ENTITY, entityType: INTERACTIVE_SESSION, entityId: '100'
      };
      expect(action).toMatchObject(expectedAction);
    });
  });
});
