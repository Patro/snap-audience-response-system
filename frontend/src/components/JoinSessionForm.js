import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';

class JoinSessionForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="JoinSessionForm">
        <Form>
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
