import React from 'react';
import { Form, Button, Input } from 'antd';
import { mount } from 'enzyme';
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

  it('calls on submit handler with label on form submit', () => {
    const onSubmit = jest.fn();

    const wrapper = mount(<StartSessionForm onSubmit={onSubmit} />);
    inputLabelAndSubmit(wrapper, 'My Super Session')

    expect(onSubmit).toBeCalledWith('My Super Session');
  });
});
