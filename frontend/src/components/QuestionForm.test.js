import React from 'react';
import { Form, Button } from 'antd';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import {
  MULTIPLE_CHOICE_QUESTION,
  SINGLE_CHOICE_QUESTION,
  QUESTION_OPTION
} from '../constants/entityTypes';
import JobErrorAlert from './JobErrorAlert';
import QuestionForm from './QuestionForm';

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

class TestWrapper extends AbstractTestWrapper {
  get inner() {
    return this.wrapper.dive();
  }

  get jobErrorAlert() {
    return this.inner.find(JobErrorAlert);
  }

  get form() {
    return this.inner.find(Form);
  }

  get questionTextInput() {
    return this.inner.find('.question_form__question_text').first();
  }

  get questionTypeRadioGroup() {
    return this.inner.find('.question_form__question_type').first();
  }

  get optionTextInputs() {
    return this.inner.find('.question_form__option_text');
  }

  get addOptionButton() {
    return this.inner.find('.question_form__add_option_button').first();
  }

  get removeOptionButtons() {
    return this.inner.find('.question_form__remove_option_button');
  }

  get submitButton() {
    return this.inner.find(Button).filter('[htmlType="submit"]').first();
  }

  _render() {
    return shallow(<QuestionForm {...this.props} />);
  }

  update() {
    this.wrapper.update();
  }

  setQuestionText(text) {
    this.questionTextInput.simulate('change', { target: { value: text } });
  }

  setQuestionType(type) {
    this.questionTypeRadioGroup.simulate('change', { target: { value: type } });
  }

  addOption() {
    this.addOptionButton.simulate('click');
    this.update();
  }

  setOptionText(index, text) {
    this.optionTextInputs.at(index)
      .simulate('change', { target: { value: text } });
  }

  removeOption(index) {
    this.removeOptionButtons.at(index).simulate('click');
    this.update();
  }

  submit() {
    this.form.simulate('submit', { preventDefault: () => {} });
  }
}

describe('QuestionForm', () => {
  describe('given question and options', () => {
    let component;

    beforeEach(() => {
      component = new TestWrapper({ props: { question, options } });
    });

    it('sets question text', () => {
      const value = component.questionTextInput.prop('value');
      expect(value).toEqual('What is the meaning of life?');
    });

    it('sets question type', () => {
      const value = component.questionTypeRadioGroup.prop('value');
      expect(value).toEqual(MULTIPLE_CHOICE_QUESTION);
    });

    it('renders text input for every option', () => {
      const inputs = component.optionTextInputs;
      expect(inputs).toHaveLength(3);
    });

    it('sets option text', () => {
      const firstValue = component.optionTextInputs.first().prop('value');
      expect(firstValue).toEqual('Eat, Sleep, Rave, Repeat');
    });

    it('renders submit button', () => {
      expect(component.submitButton).toHaveLength(1);
    });

    it('renders job error alert', () => {
      expect(component.jobErrorAlert).toHaveLength(1);
    });

    describe('on add option', () => {
      it('adds new option text input', () => {
        component.addOption();
        expect(component.optionTextInputs).toHaveLength(4);
      });
    });

    describe('on remove option', () => {
      it('removes one option text input', () => {
        component.removeOption(0);
        expect(component.optionTextInputs).toHaveLength(2);
      });
    });

    describe('on submit', () => {
      let onSubmit;

      beforeEach(() => {
        onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;
      });

      describe('without any changes', () => {
        it('calls handler with unchanged question and options', () => {
          component.submit();

          expect(onSubmit).toBeCalledWith({ question, options });
        });
      });

      describe('with updated question text', () => {
        it('calls handler with updated question text', () => {
          component.setQuestionText('Updated question text');
          component.submit();

          const updatedQuestion = {
            ...question,
            attributes: { text: 'Updated question text' },
          };
          expect(onSubmit).toBeCalledWith({
            question: updatedQuestion, options
          });
        });
      });

      describe('with updated question type', () => {
        it('calls handler with updated question type', () => {
          component.setQuestionType(SINGLE_CHOICE_QUESTION);
          component.submit();

          const updatedQuestion = {
            ...question,
            type: SINGLE_CHOICE_QUESTION
          };
          expect(onSubmit).toBeCalledWith({
            question: updatedQuestion, options
          });
        });
      });

      describe('with updated option text', () => {
        it('calls handler with updated option text', () => {
          component.setOptionText(0, 'Updated option text');
          component.submit();

          const updatedOptions = options.slice();
          updatedOptions[0] = {
            ...options[0],
            attributes: {
              text: 'Updated option text',
            },
          };
          expect(onSubmit).toBeCalledWith({
            question, options: updatedOptions
          });
        });
      });

      describe('with removed option', () => {
        it('calls handler with option marked as deleted', () => {
          component.removeOption(1);
          component.submit();

          const updatedOptions = options.slice();
          updatedOptions[1] = {
            ...options[1],
            deleted: true
          };
          expect(onSubmit).toBeCalledWith({
            question, options: updatedOptions
          });
        });
      });

      describe('with added option', () => {
        it('calls handler with new option', () => {
          component.addOption();
          component.setOptionText(3, 'New option text');
          component.submit();

          const updatedOptions = options.slice();
          updatedOptions.push({
            type: QUESTION_OPTION,
            attributes: {
              text: 'New option text',
            }
          })
          expect(onSubmit).toBeCalledWith({
            question, options: updatedOptions
          });
        });
      });

      describe('with save job', () => {
        beforeEach(() => {
          const job = factories.job.started();
          component.props.saveJob = job;
        });

        it('does not call handler', () => {
          component.submit();

          expect(onSubmit).not.toBeCalled();
        });
      });
    });
  });

  describe('without question and options', () => {
    let component;

    beforeEach(() => {
      component = new TestWrapper();
    });

    it('renders three option text inputs as default', () => {
      const inputs = component.optionTextInputs;
      expect(inputs).toHaveLength(3);
    });

    describe('on submit', () => {
      let onSubmit;

      beforeEach(() => {
        onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;
      });

      describe('with valid input', () => {
        it('calls handler with question and options', () => {
          component.setQuestionText('My new question');
          component.setQuestionType(SINGLE_CHOICE_QUESTION);
          component.setOptionText(0, 'First option');
          component.setOptionText(1, 'Second option');
          component.setOptionText(2, 'Third option');
          component.submit();

          expect(onSubmit).toBeCalledWith({
            question: {
              type: SINGLE_CHOICE_QUESTION,
              attributes: { text: 'My new question' },
            },
            options: [
              {
                type: QUESTION_OPTION,
                attributes: { text: 'First option' },
              },
              {
                type: QUESTION_OPTION,
                attributes: { text: 'Second option' },
              },
              {
                type: QUESTION_OPTION,
                attributes: { text: 'Third option' },
              },
            ],
          });
        });
      });
    });
  });
});
