import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount, shallow } from 'enzyme';
import App from './App';
import Welcome from './Welcome';

const setupStore = () => ( configureStore()() );

describe('App', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={setupStore()}>
        <App />
      </Provider>
    )
  });

  it('renders welcome component', () => {
    const wrapper = shallow(<App />);
    const form = wrapper.find(Welcome);
    expect(form.length).toBe(1);
  });
});
