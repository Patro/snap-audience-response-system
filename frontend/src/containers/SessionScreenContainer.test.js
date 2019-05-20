import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { fetchEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import SessionScreen from '../components/SessionScreen';
import SessionScreenContainer from './SessionScreenContainer';

class TestWrapper extends AbstractTestWrapper {
  get sessionScreen() {
    return this.wrapper.find(SessionScreen);
  }

  get givenInteractiveSession() {
    return this.sessionScreen.prop('interactiveSession');
  }

  _render() {
    return mount(this._addStoreProvider(this._addStaticRouter(
      <SessionScreenContainer {...this.props} />
    )));
  }

  refresh() {
    this.sessionScreen.props().onRefresh();
  }
}

describe('SessionScreenContainer', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper({
      props: {
        match: { params: { id: '100' } },
      }
    });
  });

  describe('given filled store', () => {
    let session;

    beforeEach(() => {
      session = factories.interactiveSession.entity({ id: '100' });
      component.store = buildTestState({ entities: [session] });
    });

    it('passes interactive session to component', () => {
      expect(component.givenInteractiveSession).toEqual(session);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = Immutable.Map();
    });

    it('passes undefined as interactive session to component', () => {
      expect(component.givenInteractiveSession).toBeUndefined();
    });
  });

  it('dispatches fetch entity action on refresh', () => {
    component.refresh();

    const action = component.store.getActions().slice(-1)[0];
    const expectedAction = fetchEntity(
      INTERACTIVE_SESSION, '100', expect.anything()
    );
    expect(action).toMatchObject(expectedAction);
  });
});
