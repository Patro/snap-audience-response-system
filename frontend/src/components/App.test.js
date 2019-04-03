import React from 'react';
import { mount } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import App from './App';
import SessionScreenContainer from './../containers/SessionScreenContainer';
import WelcomeScreen from './WelcomeScreen';

class TestWrapper extends AbstractTestWrapper {
  get welcomeScreen() {
    return this.wrapper.find(WelcomeScreen).first();
  }

  get sessionScreenContainer() {
    return this.wrapper.find(SessionScreenContainer).first();
  }

  _render() {
    return mount(this._addStoreProvider(this._addStaticRouter(
      <App {...this.props} />
    )))
  }

  setRootPath() {
    this.location = { pathname: '/' };
  }

  setInteractiveSessionPath() {
    this.location = { pathname: '/interactive_sessions/12' };
  }

  setPhantasyPath() {
    this.location = { pathname: '/spaceship' };
  }
}

describe('App', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('given root path', () => {
    beforeEach(() => {
      component.setRootPath();
    });

    it('renders welcome screen component', () => {
      expect(component.welcomeScreen).toHaveLength(1);
    });
  });

  describe('given interactive session path', () => {
    beforeEach(() => {
      component.setInteractiveSessionPath();
    });

    it('renders session screen container', () => {
      expect(component.sessionScreenContainer).toHaveLength(1);
    });
  });

  describe('given phantasy path', () => {
    beforeEach(() => {
      component.setPhantasyPath();
    });

    it('does not render welcome screen component', () => {
      expect(component.welcomeScreen).toHaveLength(0);
    });

    it('does not render session screen container', () => {
      expect(component.sessionScreenContainer).toHaveLength(0);
    });
  });
});
