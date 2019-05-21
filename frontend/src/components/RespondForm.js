import React, { Component } from 'react';
import { Card, Form, Button, Radio, Checkbox, List } from 'antd';
import isArray from 'lodash/isArray';
import { MULTIPLE_CHOICE_QUESTION } from '../constants/entityTypes';
import JobErrorAlert from './JobErrorAlert';
import './RespondForm.css';

class RespondForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  get form() {
    return this.props.form;
  }

  get question() {
    return this.props.question;
  }

  get questionType() {
    return this.question.get('type');
  }

  get isMultipleChoice() {
    return this.questionType === MULTIPLE_CHOICE_QUESTION;
  }

  get options() {
    return this.props.options;
  }

  get job() {
    return this.props.respondJob;
  }

  get processing() {
    return this.props.processing;
  }

  get onSubmit() {
    return this.props.onSubmit;
  }

  get itemComponent() {
    return this.isMultipleChoice ? Checkbox : Radio;
  }

  render() {
    if (this.question === undefined || this.options === undefined) {
      return false;
    }

    return (
      <div className="respond_form">
        <Card title={this.renderTitle()}>
          <JobErrorAlert job={this.job} />
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              { this.form.getFieldDecorator(`selection`, {
                rules: [
                  { required: true, message: 'Please select an option.' },
                ],
              })(this.renderSelection()) }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={this.processing}>
                Send
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

  renderSelection() {
    const Item = this.itemComponent;
    return (
      <Item.Group>
        <List
          bordered
          dataSource={this.options.toJS()}
          renderItem={this.renderOption}
        />
      </Item.Group>
    )
  }

  renderTitle() {
    return (
      <div className="respond_form__title">
        {this.question.getIn(['attributes', 'text'])}
      </div>
    );
  }

  renderOption(option) {
    const Item = this.itemComponent;
    return (
      <List.Item key={option.id} className="respond_form__list_item">
        <Item value={option.id} className="respond_form__option">
          {option.attributes.text}
        </Item>
      </List.Item>
    )
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.processing) { return; }

    this.form.validateFields((err, fieldsValue) => {
      if (err) { return; }

      const optionIds = this.selectedOptionIds(fieldsValue);
      this.onSubmit(optionIds);
    })
  }

  selectedOptionIds(fieldsValue) {
    const selection = fieldsValue['selection'];
    if (isArray(selection)) {
      return selection;
    }
    return [selection];
  }
}

export default Form.create({})(RespondForm);
