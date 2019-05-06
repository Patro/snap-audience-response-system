import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import SessionScreen from './SessionScreen';
import AttendeeScreenContainer from '../containers/AttendeeScreenContainer';
import PresenterScreen from './PresenterScreen';
import OwnerScreen from './OwnerScreen';

class TestWrapper extends AbstractTestWrapper {
  get label() {
    return this.wrapper.find('.interactive_session__label');
  }

  get attendeeScreenContainer() {
    return this.wrapper.find(AttendeeScreenContainer);
  }

  get presenterScreen() {
    return this.wrapper.find(PresenterScreen);
  }

  get ownerScreen() {
    return this.wrapper.find(OwnerScreen);
  }

  _render() {
    return mount(this._addStoreProvider(this._addStaticRouter(
      <SessionScreen {...this.props} />
    )));
  }

  setAttendeePath() {
    this.location = { pathname: '/interactive_sessions/12' };
  }

  setPresenterPath() {
    this.location = { pathname: '/interactive_sessions/12/presenter/polls/21' };
  }

  setOwnerPath() {
    this.location = { pathname: '/interactive_sessions/12/owner' };
  }
}

describe('SessionScreen', () => {
  let component;

  beforeEach(() => {
    const session = factories.interactiveSession.entity({
      attributes: { label: 'My Event' },
    });
    component = new TestWrapper({ props: {
      interactiveSession: session,
    }});
  });

  it('renders label of session', () => {
    expect(component.label.text()).toEqual('My Event');
  });

  describe('given attendee path', () => {
    beforeEach(() => {
      component.setAttendeePath();
    });

    it('renders attendee screen container', () => {
      expect(component.attendeeScreenContainer).toHaveLength(1);
    });
  });

  describe('given presenter path', () => {
    beforeEach(() => {
      component.setPresenterPath();
    });

    it('renders presenter screen', () => {
      expect(component.presenterScreen).toHaveLength(1);
    });
  });

  describe('given owner path', () => {
    beforeEach(() => {
      component.setOwnerPath();
    });

    it('renders owner screen', () => {
      expect(component.ownerScreen).toHaveLength(1);
    });
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    component.props.onRefresh = refreshHandler;

    component._render();

    expect(refreshHandler).toBeCalled();
  });
});
