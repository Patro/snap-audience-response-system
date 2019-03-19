import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';

class JoinSessionForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

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
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="Attendance Code">
            { getFieldDecorator('attendance_code')(
              <Input placeholder="ABCD" />
            ) }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Join</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({})(JoinSessionForm);
