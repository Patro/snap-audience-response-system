import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import App from './App';
import InteractiveSession from './InteractiveSession';
import Welcome from './Welcome';

const setupStore = () => ( configureStore()() );
const mountApp = ({ location = {}, context = {} } = {}) => (
  mount(
    <Provider store={setupStore()}>
      <StaticRouter location={location} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  )
)

describe('App', () => {
  it('renders without crashing', () => {
    mountApp();
  });

  describe('given root path', () => {
    const location = { pathname: '/' };

    it('renders welcome component', () => {
      const wrapper = mountApp({ location });
      const form = wrapper.find(Welcome);
      expect(form.length).toBe(1);
    });
  });

  describe('given interactive session path', () => {
    const location = { pathname: '/interactive_sessions/12' };

    it('renders interactive session component', () => {
      const wrapper = mountApp({ location });
      const form = wrapper.find(InteractiveSession);
      expect(form.length).toBe(1);
    });
  });

  describe('given phantasy path', () => {
    const location = { pathname: '/spaceship' };

    it('does not render welcome component', () => {
      const wrapper = mountApp({ location });
      const form = wrapper.find(Welcome);
      expect(form.length).toBe(0);
    });

    it('does not render interactive session component', () => {
      const wrapper = mountApp({ location });
      const form = wrapper.find(InteractiveSession);
      expect(form.length).toBe(0);
    });
  });
});
