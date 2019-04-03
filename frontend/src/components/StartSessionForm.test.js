import React from 'react';
import { Form, Button, Input } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import JobErrorAlert from './JobErrorAlert';
import StartSessionForm from './StartSessionForm';

class TestWrapper extends AbstractTestWrapper {
  get jobErrorAlert() {
    return this.wrapper.find(JobErrorAlert);
  }

  get form() {
    return this.wrapper.find(Form).first();
  }

  get labelInput() {
    return this.wrapper.find(Input).filter('#label').first();
  }

  get submitButton() {
    return this.wrapper.find(Button).filter('[htmlType="submit"]');
  }

  _render() {
    return mount(<StartSessionForm {...this.props} />)
  }

  setLabel(label) {
    this.labelInput.simulate('change', {
      target: { value: label }
    });
  }

  submit() {
    this.form.simulate('submit');
  }
}

describe('StartSessionForm', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders input box for label', () => {
    expect(component.labelInput).toHaveLength(1);
  });

  it('renders submit button', () => {
    expect(component.submitButton).toHaveLength(1);
  });

  it('renders job error alert', () => {
    expect(component.jobErrorAlert).toHaveLength(1);
  });

  describe('on submit', () => {
    describe('without start job', () => {
      it('calls on submit handler with label', () => {
        const onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;

        component.setLabel('My Super Session');
        component.submit();

        expect(onSubmit).toBeCalledWith('My Super Session');
      });
    });

    describe('given start job', () => {
      beforeEach(() => {
        component.props.startJob = factories.job.started();
      });

      it('does not call on submit handler', () => {
        const onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;

        component.setLabel('My Super Session');
        component.submit();

        expect(onSubmit).not.toBeCalled();
      });
    });
  });
});
