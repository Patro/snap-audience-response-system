import React from 'react';
import { Form, Button, Radio, Checkbox } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import RespondForm from './RespondForm';

const question = factories.multipleChoiceQuestion.entity({
  attributes: { text: 'What is the meaning of life?' },
});
const options = [
  factories.questionOption.entity({
    id: 234,
    attributes: { text: 'Eat, Sleep, Rave, Repeat' },
  }),
  factories.questionOption.entity({
    id: 123,
    attributes: { text: '42' },
  }),
  factories.questionOption.entity({
    id: 923,
    attributes: { text: 'I don\'t know' },
  }),
];

const mountForm = (question, options, onSubmit, respondJob) => (
  mount(
    <RespondForm
      question={question}
      options={options}
      onSubmit={onSubmit}
      respondJob={respondJob} />
  )
);
const getForm = (wrapper) => (
  wrapper.find(Form)
);
const getHeader = (wrapper) => (
  wrapper.find('.respond_form__header')
);
const getOptionLabels = (wrapper) => (
  wrapper.find('label.respond_form__option')
);
const getSubmitButton = (wrapper) => (
  wrapper.find(Button).filter('[htmlType="submit"]')
);
const checkInputElement = (item) => {
  const inputElement = item.find('input');
  inputElement.instance().checked = true;
  inputElement.simulate('change');
};

describe('RespondForm', () => {
  it('renders text of question to header', () => {
    const wrapper = mountForm(question, options);
    const header = getHeader(wrapper);
    expect(header.text()).toEqual('What is the meaning of life?');
  });

  it('renders option labels', () => {
    const wrapper = mountForm(question, options);
    const labels = getOptionLabels(wrapper);
    expect(labels).toHaveLength(3);
  });

  it('renders text of option', () => {
    const wrapper = mountForm(question, options);
    const firstLabel = getOptionLabels(wrapper).at(0);
    expect(firstLabel.text()).toEqual('Eat, Sleep, Rave, Repeat');
  });

  it('renders submit button', () => {
    const wrapper = mountForm(question, options);
    const button = getSubmitButton(wrapper);
    expect(button).toHaveLength(1);
  });

  describe('given multiple choice question', () => {
    const multipleChoiceQuestion = factories.multipleChoiceQuestion.entity();
    const checkCheckboxesAndSubmit = (wrapper) => {
      const checkboxes = wrapper.find(Checkbox);
      checkInputElement(checkboxes.at(0));
      checkInputElement(checkboxes.at(2));
      const form = getForm(wrapper);
      form.simulate('submit');
    };

    it('renders a checkbox for every option', () => {
      const wrapper = mountForm(multipleChoiceQuestion, options);
      const checkboxes = wrapper.find(Checkbox);
      expect(checkboxes).toHaveLength(3);
    });

    describe('without respond job', () => {
      it('calls on submit handler with ids of selected options', () => {
        const onSubmit = jest.fn();

        const wrapper = mountForm(multipleChoiceQuestion, options, onSubmit);
        checkCheckboxesAndSubmit(wrapper);

        expect(onSubmit).toBeCalledWith([234, 923]);
      });
    });

    describe('given respond job', () => {
      it('does not call on submit handler on form submit', () => {
        const onSubmit = jest.fn();

        const job = factories.job.started();
        const wrapper = mountForm(
          multipleChoiceQuestion, options, onSubmit, job
        );
        checkCheckboxesAndSubmit(wrapper);

        expect(onSubmit).not.toBeCalled();
      });
    });
  });

  describe('given single choice question', () => {
    const singleChoiceQuestion = factories.singleChoiceQuestion.entity();
    const checkRadioBoxAndSubmit = (wrapper) => {
      const radioBoxes = wrapper.find(Radio);
      checkInputElement(radioBoxes.at(1));
      const form = getForm(wrapper);
      form.simulate('submit');
    };

    it('renders a radio box for every option', () => {
      const wrapper = mount(
        <RespondForm question={singleChoiceQuestion} options={options} />
      );
      const radioBoxes = wrapper.find(Radio);
      expect(radioBoxes).toHaveLength(3);
    });

    describe('without respond job', () => {
      it('calls on submit handler with id of selected option', () => {
        const onSubmit = jest.fn();

        const wrapper = mountForm(singleChoiceQuestion, options, onSubmit);
        checkRadioBoxAndSubmit(wrapper);

        expect(onSubmit).toBeCalledWith([123]);
      });
    });

    describe('given respond job', () => {
      it('does not call on submit handler on form submit', () => {
        const onSubmit = jest.fn();

        const job = factories.job.started();
        const wrapper = mountForm(
          singleChoiceQuestion, options, onSubmit, job
        );
        checkRadioBoxAndSubmit(wrapper);

        expect(onSubmit).not.toBeCalled();
      });
    });
  });
});
