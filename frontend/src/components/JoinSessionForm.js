import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import JobErrorAlert from './JobErrorAlert';

class JoinSessionForm extends Component {
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

      const attendanceCode = fieldsValue['attendance_code'];
      this.props.onSubmit(attendanceCode);
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="join_session_form">
        <JobErrorAlert job={this.props.joinJob} />
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Attendance Code">
            { getFieldDecorator('attendance_code')(
              <Input placeholder="ABCD" />
            ) }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={this.processing}>
              Join
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({})(JoinSessionForm);
