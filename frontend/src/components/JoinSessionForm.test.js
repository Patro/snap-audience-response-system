import React from 'react';
import { Form, Button, Input } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
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
    describe('without join job', () => {
      it('calls on submit handler with attendance', () => {
        const onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;

        component.setAttendanceCode('ABCD');
        component.submit();

        expect(onSubmit).toBeCalledWith('ABCD');
      });
    });

    describe('given join job', () => {
      beforeEach(() => {
        component.props.joinJob = factories.job.started();
      });

      it('does not call on submit handler', () => {
        const onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;

        component.setAttendanceCode('ABCD');
        component.submit();

        expect(onSubmit).not.toBeCalled();
      });
    });
  });
});
