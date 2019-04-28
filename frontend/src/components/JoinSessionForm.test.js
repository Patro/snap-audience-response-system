import React from 'react';
import { Form, Button, Input } from 'antd';
import { mount } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import JobErrorAlert from './JobErrorAlert';
import JoinSessionForm from './JoinSessionForm';

class TestWrapper extends AbstractTestWrapper {
  get jobErrorAlert() {
    return this.wrapper.find(JobErrorAlert).first();
  }

  get form() {
    return this.wrapper.find(Form).first();
  }

  get attendanceCodeInput() {
    return this.wrapper.find(Input).filter('#attendance_code');
  }

  get submitButton() {
    return this.wrapper.find(Button).filter('[htmlType="submit"]');
  }

  _render() {
    return mount(<JoinSessionForm {...this.props} />)
  }

  setAttendanceCode(attendanceCode) {
    this.attendanceCodeInput.simulate('change', {
      target: { value: attendanceCode }
    });
  }

  submit() {
    this.form.simulate('submit');
  }
}

describe('JoinSessionForm', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders input box for attendance code', () => {
    expect(component.attendanceCodeInput).toHaveLength(1);
  });

  it('renders submit button', () => {
    expect(component.submitButton).toHaveLength(1);
  });

  it('renders job error alert', () => {
    expect(component.jobErrorAlert).toHaveLength(1);
  });

  describe('on submit', () => {
    let onSubmit;

    beforeEach(() => {
      onSubmit = jest.fn();
      component.props.onSubmit = onSubmit;
    });

    describe('given processing flag set to false', () => {
      beforeEach(() => {
        component.props.processing = false;
      });

      it('calls on submit handler with attendance', () => {
        component.setAttendanceCode('ABCD');
        component.submit();

        expect(onSubmit).toBeCalledWith('ABCD');
      });
    });

    describe('given processing flag set to true', () => {
      beforeEach(() => {
        component.props.processing = true;
      });

      it('does not call on submit handler', () => {
        component.setAttendanceCode('ABCD');
        component.submit();

        expect(onSubmit).not.toBeCalled();
      });
    });
  });
});
