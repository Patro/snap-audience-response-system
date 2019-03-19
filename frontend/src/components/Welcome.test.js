import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount, shallow } from 'enzyme'
import Welcome from './Welcome';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';

const setupStore = () => ( configureStore()() );

describe('Welcome', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={setupStore()}>
        <Welcome />
      </Provider>
    )
  });

  it('renders join form container', () => {
    const wrapper = shallow(<Welcome />);
    const form = wrapper.find(JoinSessionFormContainer);
    expect(form.length).toBe(1);
  });
});
