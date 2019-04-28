import React, { Component } from 'react';
import { Form, Button, Input, Radio, Switch, Icon, Divider } from 'antd';
import {
  MULTIPLE_CHOICE_QUESTION,
  QUESTION_OPTION,
  SINGLE_CHOICE_QUESTION
} from '../constants/entityTypes';
import JobErrorAlert from './JobErrorAlert';

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
    return this.props.question || {
      relationships: {
        interactiveSession: {
          id: this.interactiveSession.id,
          type: this.interactiveSession.type
        },
      }
    };
  }

  get options() {
    return this.props.options || [];
  }

  get processing() {
    return this.props.processing;
  }

  render() {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    }
    return (
      <div className="question_form">
        <JobErrorAlert job={this.props.saveJob} />
        <Form {...layout} onSubmit={this.submit}>
          {this.renderQuestionFields()}
          {this.renderOptionsFields()}
          {this.renderAddOptionButton()}
          {this.renderSubmitButton()}
        </Form>
      </div>
    );
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
      </>
    )
  }

  renderOptionKeys() {
    return (
      <Form.Item wrapperCol={ { offset: 4 } }>
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
          { this.form.getFieldDecorator(`options.${optionKey}.text`, {
              rules: [{
                required: true,
                whitespace: true,
                message: "Please provide some text or remove this option.",
              }],
          })(
            <Input className="question_form__option__text" />
          ) }
          {this.renderActionsOfOption(optionKey)}
        </Form.Item>
        <Form.Item label="Is correct?">
          { this.form.getFieldDecorator(
            `options.${optionKey}.correct`,
            { valuePropName: 'checked' }
          )(
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              className="question_form__option__correct_flag" />
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
      <Form.Item wrapperCol={ { offset: 4 } }>
        <Button
          icon="plus"
          onClick={this.addOption}
          className="question_form__add_option_button">Add option</Button>
      </Form.Item>
    );
  }

  renderSubmitButton() {
    return (
      <Form.Item wrapperCol={ { offset: 4 } }>
        <Button type="primary" htmlType="submit" loading={this.processing}>
          Save
        </Button>
      </Form.Item>
    )
  }

  componentDidMount() {
    this.refresh();
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

      this.props.onSubmit({
        question: this.mapFieldsValueToQuestion(fieldsValue),
        options: this.mapFieldsValueToOptions(fieldsValue),
      });
    });
  }

  mapFieldsValueToQuestion(fieldsValue) {
    return {
      ...this.question,
      type: fieldsValue.question.type,
      attributes: {
        text: fieldsValue.question.text,
      }
    };
  }

  mapFieldsValueToOptions(fieldsValue) {
    let existingOptions = this.mapFieldsValueToExistingOptions(fieldsValue);
    let newOptions = this.buildNewOptions(fieldsValue);
    return existingOptions.concat(newOptions);
  }

  mapFieldsValueToExistingOptions(fieldsValue) {
    return this.options.map(option =>
      this.mapFieldsValueToExistingOption(option, fieldsValue)
    );
  }

  mapFieldsValueToExistingOption(option, fieldsValue) {
    const optionFormId = getOptionFormId(option);
    if (fieldsValue.optionKeys.indexOf(optionFormId) === -1) {
      return this.buildDeletedOption(option);
    }
    else {
      return this.buildUpatedOption(option, fieldsValue);
    }
  }

  buildDeletedOption(option) {
    return {
      ...option,
      deleted: true,
    };
  }

  buildUpatedOption(option, fieldsValue) {
    const optionFormId = getOptionFormId(option);
    const values = fieldsValue.options[optionFormId];
    return {
      ...option,
      attributes: {
        text: values.text,
        correct: values.correct || false,
      },
    };
  }

  buildNewOptions(fieldsValue) {
    const newKeys = fieldsValue.optionKeys.filter(key =>
      key.startsWith(prefixes.default) || key.startsWith(prefixes.new)
    );
    return newKeys.map(key => ({
      type: QUESTION_OPTION,
      attributes: {
        text: fieldsValue.options[key].text,
        correct: fieldsValue.options[key].correct || false,
      },
    }));
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }
}

export default Form.create({
  name: 'question_form',
  mapPropsToFields: (props) => mapQuestionAndOptionsToFields({
    question: props.question || defaultQuestion(),
    options: rejectDeletedOptions(props.options) || defaultOptions(),
  })
})(QuestionForm);

///////////////////////////////////////////////////////////////////////////////

const prefixes = {
  default: 'default',
  new: 'new',
  existing: 'option',
};

const defaultQuestion = () => ({
  attributes: { text: '' },
});

const defaultOptions = () => (
  [1, 2, 3].map(defaultOption)
);

const defaultOption = (idSuffix) => ({
  id: [prefixes.default, idSuffix].join('_'),
  type: QUESTION_OPTION,
  attributes: { text: '', correct: false },
});

const rejectDeletedOptions = (options) => {
  if (options === undefined) { return; }

  return options.filter(option => option.deleted !== true);
};

const mapQuestionAndOptionsToFields = ({ question, options }) => ({
  question: mapQuestionToFields(question),
  options: mapOptionsToFields(options),
  optionKeys: mapOptionsToKeys(options),
});

const mapQuestionToFields = question => ({
  text: Form.createFormField({
    value: question.attributes.text,
  }),
  type: Form.createFormField({
    value: question.type,
  }),
})

const mapOptionsToFields = options => {
  const optionsById = {};
  options.forEach(option =>
    optionsById[getOptionFormId(option)] = mapOptionToFields(option)
  )
  return optionsById;
};

const mapOptionToFields = option => ({
  text: Form.createFormField({
    value: option.attributes.text,
  }),
  correct: Form.createFormField({
    value: option.attributes.correct,
  }),
});

const mapOptionsToKeys = options => (
  Form.createFormField({
    value: options.map(getOptionFormId)
  })
);

const getOptionFormId = option => {
  if (typeof(option.id) === 'string') {
    return option.id;
  }
  else {
    return [prefixes.existing, option.id].join('_');
  }
};
