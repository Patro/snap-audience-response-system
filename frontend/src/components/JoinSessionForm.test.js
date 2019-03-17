import React from 'react';
import { Button, Input } from 'antd';
import { mount } from 'enzyme';
import JoinSessionForm from './JoinSessionForm';

describe('JoinSessionForm', () => {
  it('should render input box for attendance code', () => {
    const wrapper = mount(<JoinSessionForm />);
    const input = wrapper.find(Input).filter('#attendance_code');
    expect(input).toHaveLength(1);
  });

  it('should render submit button', () => {
    const wrapper = mount(<JoinSessionForm />);
    const button = wrapper.find(Button);
    expect(button).toHaveLength(1);
  });
});
