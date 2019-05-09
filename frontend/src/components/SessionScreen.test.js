import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import SessionScreen from './SessionScreen';
import AttendeeScreenContainer from '../containers/AttendeeScreenContainer';
import PresenterScreenContainer from '../containers/PresenterScreenContainer';
import OwnerScreen from './OwnerScreen';

class TestWrapper extends AbstractTestWrapper {
  get text() {
    return this.wrapper.text();
  }

  get attendeeScreenContainer() {
    return this.wrapper.find(AttendeeScreenContainer);
  }

  get presenterScreen() {
    return this.wrapper.find(PresenterScreenContainer);
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
      attributes: { label: 'My Event', attendanceCode: 'ABCD' },
    });
    component = new TestWrapper({ props: {
      interactiveSession: session,
    }});
  });

  it('renders label of session', () => {
    expect(component.text).toContain('My Event');
  });

  it('renders attendance code', () => {
    expect(component.text).toContain('ABCD');
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
});
