import React, { Component } from 'react';
import RespondForm from './RespondForm';

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
        <RespondForm/>
      </div>
    );
  }
}

export default AttendeeScreen;
