import React, { Component } from 'react';
import RespondFormContainer from '../containers/RespondFormContainer';

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
        {this.renderRespondFormContainer()}
      </div>
    );
  }

  renderRespondFormContainer() {
    const poll = this.props.unrespondedPoll;
    if (poll === undefined) { return; }

    return (<RespondFormContainer poll={poll} />)
  }
}

export default AttendeeScreen;
