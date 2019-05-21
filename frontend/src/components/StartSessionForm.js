import React, { Component } from 'react';
import { Card, Form, Button, Input } from 'antd';
import JobErrorAlert from './JobErrorAlert';

class StartSessionForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get form() {
    return this.props.form;
  }

  get job() {
    return this.props.startJob;
  }

  get processing() {
    return this.props.processing;
  }

  get onSubmit() {
    return this.props.onSubmit;
  }

  render() {
    return (
      <Card title="Start your own session" className="start_session_form">
        <JobErrorAlert job={this.job} />
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Session Name">
            { this.form.getFieldDecorator('label', {
              validateTrigger: 'onSubmit',
              rules: [
                {
                  required: true,
                  message: 'Please choose a name for your session.',
                },
              ],
            })(
              <Input placeholder="My new session" />
            ) }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={this.processing}>
              Start
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.processing) { return; }

    this.form.validateFields((err, fieldsValue) => {
      if (err) { return; }

      const label = fieldsValue['label'];
      this.onSubmit(label);
    })
  }
}

export default Form.create({})(StartSessionForm);
