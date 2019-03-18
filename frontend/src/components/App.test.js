import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount, shallow } from 'enzyme';
import App from './App';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';

const setupStore = () => ( configureStore()() );

describe('App', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={setupStore()}>
        <App />
      </Provider>
    )
  });

  it('renders join form container', () => {
    const wrapper = shallow(<App />);
    const form = wrapper.find(JoinSessionFormContainer);
    expect(form.length).toBe(1);
  });
});
