import React, { Component } from 'react';

class AttendeeScreen extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  render() {
    return (
      <div className="attendee_screen">
      </div>
    );
  }
}

export default AttendeeScreen;
