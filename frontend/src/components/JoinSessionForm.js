import React, { Component } from 'react';
import { Card, Form, Button, Input } from 'antd';
import JobErrorAlert from './JobErrorAlert';

class JoinSessionForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get form() {
    return this.props.form;
  }

  get job() {
    return this.props.joinJob;
  }

  get processing() {
    return this.props.processing;
  }

  get onSubmit() {
    return this.props.onSubmit;
  }

  render() {
    return (
      <Card title="Join running session" className="join_session_form">
        <JobErrorAlert job={this.job} />
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Attendance Code">
            { this.form.getFieldDecorator('attendance_code', {
              validateTrigger: 'onSubmit',
              rules: [
                {
                  required: true,
                  message: `Please fill in the attendance code of
                    the session you'd like to join.`,
                },
                {
                  len: 4,
                  message: `Please fill in an attendance code with
                    four characters.`,
                }
              ],
              normalize: (value) => value.toUpperCase(),
            })(
              <Input placeholder="ABCD" maxLength={4} />
            ) }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={this.processing}>
              Join
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

      const attendanceCode = fieldsValue['attendance_code'];
      this.onSubmit(attendanceCode);
    })
  }
}

export default Form.create({})(JoinSessionForm);
