import React, { Component } from 'react';
import { Card, Form, Button, Radio, Checkbox, List } from 'antd';
import isArray from 'lodash/isArray';
import { MULTIPLE_CHOICE_QUESTION } from '../constants/entityTypes';
import './RespondForm.css';

class RespondForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  isMultipleChoice() {
    return this.props.question.type === MULTIPLE_CHOICE_QUESTION;
  }

  get processing() {
    return this.props.processing;
  }

  get itemComponent() {
    return this.isMultipleChoice() ? Checkbox : Radio;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.processing) { return; }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) { return; }

      const optionIds = this.selectedOptionIds(fieldsValue);
      this.props.onSubmit(optionIds);
    })
  }

  selectedOptionIds(fieldsValue) {
    const selection = fieldsValue['selection'];
    if (isArray(selection)) {
      return selection;
    }
    return [selection];
  }

  render() {
    if (this.props.question === undefined || this.props.options === undefined) {
      return false;
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <div className="respond_form">
        <Card title={this.renderTitle()}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              { getFieldDecorator(`selection`, {
                rules: [
                  { required: true, message: 'Please select an option!' },
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
          dataSource={this.props.options}
          renderItem={this.renderOption}
        />
      </Item.Group>
    )
  }

  renderTitle() {
    return (
      <div className="respond_form__title">
        {this.props.question.attributes.text}
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
}

export default Form.create({})(RespondForm);
