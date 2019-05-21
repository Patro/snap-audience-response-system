import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { fetchCollection } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import SessionList from '../components/SessionList';
import SessionListContainer from './SessionListContainer';

class TestWrapper extends AbstractTestWrapper {
  get list() {
    return this.wrapper.find(SessionList);
  }

  get givenInteractiveSessions() {
    return this.list.prop('interactiveSessions');
  }

  _render() {
    return mount(this._addStoreProvider(this._addStaticRouter(
      <SessionListContainer {...this.props} />
    )));
  }

  refresh() {
    this.list.props().onRefresh();
  }
}

describe('SessionListContainer', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('interactive sessions', () => {
    describe('given filled store', () => {
      let sessions;

      beforeEach(() => {
        sessions = Immutable.List([
          factories.interactiveSession.entity(),
          factories.interactiveSession.entity(),
        ]);
        component.store = buildTestState({
          entities: sessions,
          collections: [
            factories.collection.withEntities(sessions).merge({
              type: INTERACTIVE_SESSION,
              filterParams: Immutable.Map(),
            })
          ],
        });
      });

      it('passes sessions from store to component', () => {
        expect(component.givenInteractiveSessions).toEqual(sessions);
      });
    });

    describe('given empty store', () => {
      beforeEach(() => {
        component.store = Immutable.Map();
      });

      it('passes undefined to component', () => {
        expect(component.givenInteractiveSessions).toBeUndefined();
      });
    });
  });

  describe('on refresh', () => {
    it('dispatches fetch collection action for interactive sessions', () => {
      component.refresh();

      const actions = component.store.getActions();
      const expectedAction = fetchCollection(
        INTERACTIVE_SESSION, {}, expect.anything()
      );
      expect(actions).toContainEqual(expectedAction);
    });
  });
});
