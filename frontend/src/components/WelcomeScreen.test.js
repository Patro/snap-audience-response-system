import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount, shallow } from 'enzyme'
import WelcomeScreen from './WelcomeScreen';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';
import StartSessionForm from './StartSessionForm';

const setupStore = () => ( configureStore()() );

describe('WelcomeScreen', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={setupStore()}>
        <WelcomeScreen />
      </Provider>
    )
  });

  it('renders join form container', () => {
    const wrapper = shallow(<WelcomeScreen />);
    const form = wrapper.find(JoinSessionFormContainer);
    expect(form.length).toBe(1);
  });

  it('renders start session form', () => {
    const wrapper = shallow(<WelcomeScreen />);
    const form = wrapper.find(StartSessionForm);
    expect(form.length).toBe(1);
  });
});
