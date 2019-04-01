import React from 'react';
import { Form, Button, Input } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import JobErrorAlert from './JobErrorAlert';
import StartSessionForm from './StartSessionForm';

describe('StartSessionForm', () => {
  const getLabelInput = (wrapper) => (
    wrapper.find(Input).filter('#label')
  );
  const getSubmitButton = (wrapper) => (
    wrapper.find(Button).filter('[htmlType="submit"]')
  );
  const inputLabelAndSubmit = (wrapper, label) => {
    const input = getLabelInput(wrapper);
    input.simulate('change', { target: { value: label } });
    const form = wrapper.find(Form);
    form.simulate('submit');
  };

  it('renders input box for label', () => {
    const wrapper = mount(<StartSessionForm />);
    const input = getLabelInput(wrapper);
    expect(input).toHaveLength(1);
  });

  it('renders submit button', () => {
    const wrapper = mount(<StartSessionForm />);
    const button = getSubmitButton(wrapper);
    expect(button).toHaveLength(1);
  });

  it('renders job error alert', () => {
    const wrapper = mount(<StartSessionForm />);
    const alert = wrapper.find(JobErrorAlert);
    expect(alert).toHaveLength(1);
  });

  describe('without start job', () => {
    it('calls on submit handler with label on form submit', () => {
      const onSubmit = jest.fn();

      const wrapper = mount(<StartSessionForm onSubmit={onSubmit} />);
      inputLabelAndSubmit(wrapper, 'My Super Session')

      expect(onSubmit).toBeCalledWith('My Super Session');
    });
  });

  describe('given start job', () => {
    it('does not call on submit handler on form submit', () => {
      const onSubmit = jest.fn();

      const job = factories.job.started();
      const wrapper = mount(
        <StartSessionForm startJob={job} onSubmit={onSubmit} />
      );
      inputLabelAndSubmit(wrapper, 'My Super Session')

      expect(onSubmit).not.toBeCalled();
    });
  });
});
