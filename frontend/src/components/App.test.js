import React from 'react';
import { mount, shallow } from 'enzyme';
import App from './App';
import JoinSessionForm from './JoinSessionForm';

describe('App', () => {
  it('renders without crashing', () => {
    mount(<App/>)
  });

  it('renders join form', () => {
    const wrapper = shallow(<App />);
    const form = wrapper.find(JoinSessionForm);
    expect(form.length).toBe(1);
  });
});
