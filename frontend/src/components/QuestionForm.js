import Immutable from 'immutable';
import React, { Component } from 'react';
import { Card, Form, Button, Input, Radio, Switch, Icon, Divider } from 'antd';
import {
  MULTIPLE_CHOICE_QUESTION,
  QUESTION_OPTION,
  SINGLE_CHOICE_QUESTION
} from '../constants/entityTypes';
import JobErrorAlert from './JobErrorAlert';
import './QuestionForm.css';

class QuestionForm extends Component {
  constructor(props) {
    super(props);
    this.nextOptionKey = 0;
    this.renderOptionFields = this.renderOptionFields.bind(this);
    this.addOption = this.addOption.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.submit = this.submit.bind(this);
  }

  get form() {
    return this.props.form;
  }

  get interactiveSession() {
    return this.props.interactiveSession;
  }

  get question() {
    return this.props.question || Immutable.fromJS({
      relationships: {
        interactiveSession: {
          id: this.interactiveSession.get('id'),
          type: this.interactiveSession.get('type')
        },
      }
    });
  }

  get options() {
    return this.props.options || Immutable.List();
  }

  get isNewQuestion() {
    return this.question.get('id') === undefined;
  }

  get processing() {
    return this.props.processing;
  }

  get formLayout() {
    return {
      labelCol: { sm: { span: 4 } },
      wrapperCol: { sm: { span: 18 } },
    }
  }

  get itemWithoutLabelLayout() {
    return {
      wrapperCol: {
        sm: { offset: 4, span: 18 },
      }
    }
  }

  render() {
    return (
      <div className="question_form">
        <Card title={this.renderTitle()}>
          <JobErrorAlert job={this.props.saveJob} />
          <Form {...this.formLayout} onSubmit={this.submit}>
            {this.renderQuestionFields()}
            {this.renderOptionsFields()}
            {this.renderSubmitButton()}
          </Form>
        </Card>
      </div>
    );
  }

  renderTitle() {
    if (this.isNewQuestion) {
      return 'Create question';
    }
    else {
      return 'Edit question';
    }
  }

  renderQuestionFields() {
    return (
      <>
        <Form.Item label="Question" key="question_text">
          { this.form.getFieldDecorator('question.text', {
              rules: [{
                required: true,
                whitespace: true,
                message: "Please provide a question.",
              }],
          })(
            <Input className="question_form__question_text" />
          ) }
        </Form.Item>
        <Form.Item label="Type" key="question_type">
          { this.form.getFieldDecorator('question.type', {
              rules: [{
                required: true,
                message: "Please select a question type.",
              }],
          })(
            <Radio.Group className="question_form__question_type">
              <Radio.Button value={SINGLE_CHOICE_QUESTION}>
                Single Choice
              </Radio.Button>
              <Radio.Button value={MULTIPLE_CHOICE_QUESTION}>
                Multiple Choice
              </Radio.Button>
            </Radio.Group>
          ) }
        </Form.Item>
      </>
    );
  }

  renderOptionsFields() {
    const optionKeys = this.form.getFieldValue('optionKeys');
    return (
      <>
        {this.renderOptionKeys()}
        {optionKeys.map(this.renderOptionFields)}
        <Divider />
        {this.renderAddOptionButton()}
        <Divider />
      </>
    )
  }

  renderOptionKeys() {
    return (
      <Form.Item {...this.itemWithoutLabelLayout} >
        { this.form.getFieldDecorator('optionKeys', {
            rules: [{
              validator: (_rule, value, callback) => {
                if (value.length < 2) {
                  callback('Please provide at least two options.');
                }
                callback();
              }
            }],
        })(<></>) }
      </Form.Item>
    )
  }

  renderOptionFields(optionKey, index) {
    return (
      <div key={optionKey} className="question_form__option">
        <Divider>{`Option ${index + 1}`}</Divider>
        <Form.Item label="Text">
          <div className="question_form__option_text">
            <div className="question_form__option_text_wrapper">
              { this.form.getFieldDecorator(`options.${optionKey}.text`, {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: "Please provide some text or remove this option.",
                  }],
              })(
                <Input className="question_form__option_text_input" />
              ) }
            </div>
            {this.renderActionsOfOption(optionKey)}
          </div>
        </Form.Item>
        <Form.Item label="Is correct?">
          { this.form.getFieldDecorator(
            `options.${optionKey}.correct`,
            { valuePropName: 'checked' }
          )(
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              className="question_form__option_correct_flag" />
          ) }
        </Form.Item>
      </div>
    )
  }

  renderActionsOfOption(optionKey) {
    return (
      <Button
        type="danger"
        icon="delete"
        onClick={() => this.removeOption(optionKey)}
        className="question_form__remove_option_button" />
    );
  }

  renderAddOptionButton() {
    return (
      <Form.Item {...this.itemWithoutLabelLayout}>
        <Button
          icon="plus"
          onClick={this.addOption}
          className="question_form__add_option_button">Add option</Button>
      </Form.Item>
    );
  }

  renderSubmitButton() {
    return (
      <Form.Item {...this.itemWithoutLabelLayout}>
        <Button type="primary" htmlType="submit" loading={this.processing}>
          Save
        </Button>
      </Form.Item>
    )
  }

  addOption() {
    const keys = this.form.getFieldValue('optionKeys');
    const newKey = [prefixes.new, this.nextOptionKey++].join('_');
    const nextKeys = keys.concat(newKey);
    this.form.setFieldsValue({
      optionKeys: nextKeys,
    });
  }

  removeOption(keyToRemove) {
    const keys = this.form.getFieldValue('optionKeys');
    const nextKeys = keys.filter(key => key !== keyToRemove);
    this.form.setFieldsValue({
      optionKeys: nextKeys,
    });
  }

  submit(event) {
    event.preventDefault();
    if (this.processing) { return; }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) { return; }

      this.props.onSubmit(Immutable.Map({
        question: this.mapFieldsValueToQuestion(fieldsValue),
        options: this.mapFieldsValueToOptions(fieldsValue),
      }));
    });
  }

  mapFieldsValueToQuestion(fieldsValue) {
    return this.question.merge(Immutable.fromJS({
      type: fieldsValue.question.type,
      attributes: {
        text: fieldsValue.question.text,
      }
    }));
  }

  mapFieldsValueToOptions(fieldsValue) {
    const existingOptions = this.mapFieldsValueToExistingOptions(fieldsValue);
    const newOptions = this.buildNewOptions(fieldsValue);
    const options = existingOptions.concat(newOptions);
    return this.setPositionOfOptions(options);
  }

  mapFieldsValueToExistingOptions(fieldsValue) {
    return this.options.map(option =>
      this.mapFieldsValueToExistingOption(option, fieldsValue)
    );
  }

  mapFieldsValueToExistingOption(option, fieldsValue) {
    const optionFormId = option.get('id');
    if (fieldsValue.optionKeys.indexOf(optionFormId) === -1) {
      return this.buildDeletedOption(option);
    }
    else {
      return this.buildUpatedOption(option, fieldsValue);
    }
  }

  buildDeletedOption(option) {
    return option.set('deleted', true);
  }

  buildUpatedOption(option, fieldsValue) {
    const optionFormId = option.get('id');
    const values = fieldsValue.options[optionFormId];
    return option.merge(Immutable.fromJS({
      attributes: {
        text: values.text,
        correct: values.correct || false,
      },
    }));
  }

  buildNewOptions(fieldsValue) {
    const newKeys = fieldsValue.optionKeys.filter(key =>
      key.startsWith(prefixes.default) || key.startsWith(prefixes.new)
    );
    return Immutable.List(newKeys.map(key => Immutable.fromJS({
      type: QUESTION_OPTION,
      attributes: {
        text: fieldsValue.options[key].text,
        correct: fieldsValue.options[key].correct || false,
      },
    })));
  }

  setPositionOfOptions(options) {
    let position = 0;
    return options.map(option => {
      if (option.get('deleted') === true) {
        return this.setPositionOfOption(option, -1);
      }
      else {
        return this.setPositionOfOption(option, position++);
      }
    });
  }

  setPositionOfOption(option, position) {
    return option.setIn(['attributes', 'position'], position);
  }
}

export default Form.create({
  name: 'question_form',
  mapPropsToFields: (props) => mapQuestionAndOptionsToFields({
    question: props.question || defaultQuestion(),
    options: assignIds(rejectDeletedOptions(props.options)) || defaultOptions(),
  })
})(QuestionForm);

///////////////////////////////////////////////////////////////////////////////

const prefixes = {
  default: 'default',
  new: 'new',
};

const defaultQuestion = () => Immutable.fromJS({
  attributes: { text: '' },
});

const defaultOptions = () => (
  Immutable.List([1, 2, 3]).map(defaultOption)
);

const defaultOption = (idSuffix) => Immutable.fromJS({
  id: `${prefixes.default}_${idSuffix}`,
  type: QUESTION_OPTION,
  attributes: { text: '', correct: false },
});

const rejectDeletedOptions = (options) => {
  if (options === undefined) { return; }

  return options.filter(option => option.get('deleted') !== true);
};

const assignIds = (options) => {
  if (options === undefined) { return; }

  return options.map((option, index) =>
    Immutable.Map({ id: `_${index}` }).merge(option)
  );
};

const mapQuestionAndOptionsToFields = ({ question, options }) => ({
  question: mapQuestionToFields(question),
  options: mapOptionsToFields(options),
  optionKeys: mapOptionsToKeys(options),
});

const mapQuestionToFields = question => ({
  text: Form.createFormField({
    value: question.getIn(['attributes', 'text']),
  }),
  type: Form.createFormField({
    value: question.get('type'),
  }),
})

const mapOptionsToFields = options => {
  const optionsById = {};
  options.forEach((option, index) =>
    optionsById[option.get('id')] = mapOptionToFields(option)
  )
  return optionsById;
};

const mapOptionToFields = option => ({
  text: Form.createFormField({
    value: option.getIn(['attributes', 'text']),
  }),
  correct: Form.createFormField({
    value: option.getIn(['attributes', 'correct']),
  }),
});

const mapOptionsToKeys = options => (
  Form.createFormField({
    value: options.map(option => option.get('id'))
  })
);
