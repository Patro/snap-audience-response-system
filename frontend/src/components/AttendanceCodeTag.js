import React, { Component } from 'react';
import './AttendanceCodeTag.css'

class AttendanceCodeTag extends Component {
  get attendanceCode() {
    return this.props.attendanceCode;
  }

  get attendanceCodeChars() {
    return this.attendanceCode.split('');
  }

  render() {
    return (
      <div className="attendance_code_tag">
        <span className="attendance_code_tag__label">Attendance Code</span>
        {this.attendanceCodeChars.map((char, index) =>
          <div key={index} className="attendance_code_tag__char">
            {char}
          </div>
        )}
      </div>
    );
  }
}

export default AttendanceCodeTag;
