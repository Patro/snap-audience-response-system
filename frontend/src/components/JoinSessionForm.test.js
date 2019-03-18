import React from 'react';
import { Form, Button, Input } from 'antd';
import { mount } from 'enzyme';
import JoinSessionForm from './JoinSessionForm';

describe('JoinSessionForm', () => {
  const getForm = (wrapper) => (
    wrapper.find(Form)
  );
  const getAttendanceCodeInput = (wrapper) => (
    wrapper.find(Input).filter('#attendance_code')
  );
  const getSubmitButton = (wrapper) => (
    wrapper.find(Button).filter('[htmlType="submit"]')
  );

  it('should render input box for attendance code', () => {
    const wrapper = mount(<JoinSessionForm />);
    const input = getAttendanceCodeInput(wrapper);
    expect(input).toHaveLength(1);
  });

  it('should render submit button', () => {
    const wrapper = mount(<JoinSessionForm />);
    const button = getSubmitButton(wrapper);
    expect(button).toHaveLength(1);
  });

  it('should call on submit handler with attendance code on form submit', () => {
    const onSubmit = jest.fn();

    const wrapper = mount(<JoinSessionForm onSubmit={onSubmit} />);
    const input = getAttendanceCodeInput(wrapper);
    input.simulate('change', { target: { value: 'ABCD' } });
    const form = getForm(wrapper);
    form.simulate('submit');

    expect(onSubmit).toBeCalledWith('ABCD');
  });
});
