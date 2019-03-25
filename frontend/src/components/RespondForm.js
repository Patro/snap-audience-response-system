import React, { Component } from 'react';
import { Form, Button, Radio, Checkbox, List } from 'antd';
import isArray from 'lodash/isArray';
import { MULTIPLE_CHOICE_QUESTION } from '../constants/entityTypes';

class RespondForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  isMultipleChoice() {
    return this.props.question.type === MULTIPLE_CHOICE_QUESTION;
  }

  get itemComponent() {
    return this.isMultipleChoice() ? Checkbox : Radio;
  }

  handleSubmit(event) {
    event.preventDefault();

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
      return <></>;
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <div className="respond_form">
        <Form onSubmit={this.handleSubmit}>
          { getFieldDecorator(`selection`, {
            rules: [
              { required: true, message: 'Please select an option!' },
            ],
          })(this.renderSelection()) }
          <Form.Item>
            <Button type="primary" htmlType="submit">Send</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  renderSelection() {
    const Item = this.itemComponent;
    return (
      <Item.Group>
        <List
          header={this.renderHeader()}
          bordered
          dataSource={this.props.options}
          renderItem={this.renderOption}
        />
      </Item.Group>
    )
  }

  renderHeader() {
    return (
      <div className="respond_form__header">
        {this.props.question.attributes.text}
      </div>
    );
  }

  renderOption(option) {
    const Item = this.itemComponent;
    return (
      <List.Item key={option.id}>
        <Item value={option.id} className="respond_form__option">
          {option.attributes.text}
        </Item>
      </List.Item>
    )
  }
}

export default Form.create({})(RespondForm);
