import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import { fetchEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import SessionScreen from '../components/SessionScreen';
import SessionScreenContainer from './SessionScreenContainer';

const session = factories.interactiveSession.entity({ id: 100 });

const filledStore = {
  entities: {
    INTERACTIVE_SESSION: { 100: session },
  }
};

const setupStore = (initial) => ( configureStore()(initial) );
const mountContainer = ({ store, sessionId }) => (
  mount(
    <Provider store={store}>
      <StaticRouter location='/' context={ {} }>
        <SessionScreenContainer match={{ params: { id: sessionId } }}/>
      </StaticRouter>
    </Provider>
  )
);

describe('SessionScreenContainer', () => {
  describe('given filled store', () => {
    const store = setupStore(filledStore);

    it('passes interactive session to component', () => {
      const wrapper = mountContainer({ store, sessionId: 100 });
      const wrapped = wrapper.find(SessionScreen);

      expect(wrapped.props().interactiveSession).toEqual(session);
    });
  });

  describe('given empty store', () => {
    const store = setupStore({})

    it('passes undefined as interactive session to component', () => {
      const wrapper = mountContainer({ store, sessionId: 100 });
      const wrapped = wrapper.find(SessionScreen);

      expect(wrapped.props().interactiveSession).toBeUndefined();
    });
  });

  it('dispatches fetch entity action on refresh', () => {
    const store = setupStore();

    const wrapper = mountContainer({ store, sessionId: '100' });
    const wrapped = wrapper.find(SessionScreen);
    wrapped.props().onRefresh();

    const action = store.getActions().slice(-1)[0];
    const expectedAction = fetchEntity(INTERACTIVE_SESSION, '100');
    expect(action).toMatchObject(expectedAction);
  });
});
