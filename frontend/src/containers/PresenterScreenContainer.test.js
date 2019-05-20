import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { fetchEntity } from '../actions';
import { POLL } from '../constants/entityTypes';
import PresenterScreen from '../components/PresenterScreen';
import PresenterScreenContainer from './PresenterScreenContainer';

class TestWrapper extends AbstractTestWrapper {
  get presenterScreen() {
    return this.wrapper.find(PresenterScreen);
  }

  get givenPoll() {
    return this.presenterScreen.prop('poll');
  }

  _render() {
    return mount(this._addStoreProvider(
      <PresenterScreenContainer {...this.props} />
    ))
  }

  refresh() {
    this.presenterScreen.props().onRefresh();
  }
}

describe('PresenterScreenContainer', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper({ props: {
      match: { params: { pollId: '300' } },
    }});
  });

  describe('given filled store', () => {
    let poll;

    beforeEach(() => {
      poll = factories.poll.entity({ id: '300' });
      component.store = buildTestState({ entities: [poll] });
    });

    it('passes poll to component', () => {
      expect(component.givenPoll).toEqual(poll);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = Immutable.Map();
    });

    it('passes undefined as poll to component', () => {
      expect(component.givenPoll).toBeUndefined();
    });
  });

  it('dispatches fetch poll action on refresh', () => {
    component.refresh();

    const actions = component.store.getActions();
    const expectedAction = fetchEntity(POLL, '300', expect.anything());
    expect(actions).toContainEqual(expectedAction);
  });
});
