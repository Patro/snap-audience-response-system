import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import JobErrorAlert from './JobErrorAlert';

class StartSessionForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get processing() {
    return this.props.processing;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.processing) { return; }

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) { return; }

      const label = fieldsValue['label'];
      this.props.onSubmit(label);
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="start_session_form">
        <JobErrorAlert job={this.props.startJob} />
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Session Name">
            { getFieldDecorator('label')(
              <Input placeholder="My new session" />
            ) }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={this.processing}>
              Start
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({})(StartSessionForm);
