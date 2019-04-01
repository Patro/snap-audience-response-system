import React, { Component } from 'react';
import { Card } from 'antd';

class OwnerScreen extends Component {
  get attendanceCode() {
    return this.props.interactiveSession.attributes.attendanceCode;
  }

  render() {
    return (
      <div className="owner_screen">
        <Card title="Attendance Code">
          { this.attendanceCode }
        </Card>
      </div>
    );
  }
}

export default OwnerScreen;
