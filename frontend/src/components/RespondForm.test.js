import Immutable from 'immutable';
import React from 'react';
import { Form, Button, Radio, Checkbox } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import JobErrorAlert from './JobErrorAlert';
import RespondForm from './RespondForm';

class TestWrapper extends AbstractTestWrapper {
  get jobErrorAlert() {
    return this.wrapper.find(JobErrorAlert).first();
  }

  get form() {
    return this.wrapper.find(Form).first();
  }

  get title() {
    return this.wrapper.find('.respond_form__title');
  }

  get checkboxes() {
    return this.wrapper.find(Checkbox);
  }

  get radioBoxes() {
    return this.wrapper.find(Radio);
  }

  get optionLabels() {
    return this.wrapper.find('label.respond_form__option');
  }

  get submitButton() {
    return this.wrapper.find(Button).filter('[htmlType="submit"]');
  }

  _render() {
    return mount(<RespondForm {...this.props} />);
  }

  checkInputElement(item) {
    const inputElement = item.find('input');
    inputElement.instance().checked = true;
    inputElement.simulate('change');
  }

  checkCheckbox(index) {
    this.checkInputElement(this.checkboxes.at(index));
  }

  checkRadioBox(index) {
    this.checkInputElement(this.radioBoxes.at(index));
  };

  submit() {
    this.form.simulate('submit');
  }

  setJob(respondJob) {
    this.wrapper.setProps({ respondJob });
  }
}

describe('RespondForm', () => {
  let component;

  beforeEach(() => {
    const question = factories.multipleChoiceQuestion.entity({
      attributes: { text: 'What is the meaning of life?' },
    });
    const options = Immutable.fromJS([
      factories.questionOption.entity({
        id: '234',
        attributes: { text: 'Eat, Sleep, Rave, Repeat' },
      }),
      factories.questionOption.entity({
        id: '123',
        attributes: { text: '42' },
      }),
      factories.questionOption.entity({
        id: '923',
        attributes: { text: 'I don\'t know' },
      }),
    ]);
    component = new TestWrapper({ props: {
      question: question,
      options: options,
    }});
  });

  it('renders text of question to title', () => {
    expect(component.title.text()).toEqual('What is the meaning of life?');
  });

  it('renders option labels', () => {
    expect(component.optionLabels).toHaveLength(3);
  });

  it('renders text of option', () => {
    const firstLabel = component.optionLabels.at(0);
    expect(firstLabel.text()).toEqual('Eat, Sleep, Rave, Repeat');
  });

  it('renders submit button', () => {
    expect(component.submitButton).toHaveLength(1);
  });

  it('renders job error alert', () => {
    expect(component.jobErrorAlert).toHaveLength(1);
  });

  describe('given multiple choice question', () => {
    beforeEach(() => {
      component.props.question = factories.multipleChoiceQuestion.entity();
    });

    it('renders a checkbox for every option', () => {
      expect(component.checkboxes).toHaveLength(3);
    });

    describe('given processing flag set to false', () => {
      beforeEach(() => {
        component.props.processing = false;
      });

      it('calls on submit handler with ids of selected options', () => {
        const onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;

        component.checkCheckbox(0);
        component.checkCheckbox(2);
        component.submit();

        expect(onSubmit).toBeCalledWith(['234', '923']);
      });
    });

    describe('given processing flag set to true', () => {
      beforeEach(() => {
        component.props.processing = true;
      });

      it('does not call on submit handler on form submit', () => {
        const onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;

        component.checkCheckbox(0);
        component.checkCheckbox(2);
        component.submit();

        expect(onSubmit).not.toBeCalled();
      });
    });
  });

  describe('given single choice question', () => {
    beforeEach(() => {
      component.props.question = factories.singleChoiceQuestion.entity();
    });

    it('renders a radio box for every option', () => {
      expect(component.radioBoxes).toHaveLength(3);
    });

    describe('given processing flag set to false', () => {
      beforeEach(() => {
        component.props.processing = false;
      });

      it('calls on submit handler with id of selected option', () => {
        const onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;

        component.checkRadioBox(1);
        component.submit();

        expect(onSubmit).toBeCalledWith(['123']);
      });
    });

    describe('given processing flag set to true', () => {
      beforeEach(() => {
        component.props.processing = true;
      });

      it('does not call on submit handler on form submit', () => {
        const onSubmit = jest.fn();
        component.props.onSubmit = onSubmit;

        component.checkRadioBox(1);
        component.submit();

        expect(onSubmit).not.toBeCalled();
      });
    });
  });
});
