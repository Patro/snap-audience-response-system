import React from 'react';
import { Form, Button, Input } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
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
  const inputAttendanceCodeAndSubmit = (wrapper, attendanceCode) => {
    const input = getAttendanceCodeInput(wrapper);
    input.simulate('change', { target: { value: attendanceCode } });
    const form = getForm(wrapper);
    form.simulate('submit');
  };

  it('renders input box for attendance code', () => {
    const wrapper = mount(<JoinSessionForm />);
    const input = getAttendanceCodeInput(wrapper);
    expect(input).toHaveLength(1);
  });

  it('renders submit button', () => {
    const wrapper = mount(<JoinSessionForm />);
    const button = getSubmitButton(wrapper);
    expect(button).toHaveLength(1);
  });

  describe('without join job', () => {
    it('calls on submit handler with attendance code on form submit', () => {
      const onSubmit = jest.fn();

      const wrapper = mount(<JoinSessionForm onSubmit={onSubmit} />);
      inputAttendanceCodeAndSubmit(wrapper, 'ABCD')

      expect(onSubmit).toBeCalledWith('ABCD');
    });
  });

  describe('given join job', () => {
    it('does not call on submit handler on form submit', () => {
      const onSubmit = jest.fn();

      const job = factories.job.started();
      const wrapper = mount(
        <JoinSessionForm joinJob={job} onSubmit={onSubmit} />
      );
      inputAttendanceCodeAndSubmit(wrapper, 'ABCD')

      expect(onSubmit).not.toBeCalled();
    });
  });
});
