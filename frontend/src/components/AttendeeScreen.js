import React, { Component } from 'react';
import { Alert, Icon } from 'antd';
import RespondFormContainer from '../containers/RespondFormContainer';

class AttendeeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { respondedToPoll: false };
    this.handleSuccessfulResponse = this.handleSuccessfulResponse.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  hasUnrespondedPoll() {
    return this.props.unrespondedPoll !== undefined;
  }

  handleSuccessfulResponse() {
    this.setState({ respondedToPoll: true });
    this.refresh();
  }

  render() {
    return (
      <div className="attendee_screen">
        {this.renderSuccessInfo()}
        {this.renderContent()}
      </div>
    );
  }

  renderSuccessInfo() {
    if (!this.state.respondedToPoll) { return; }
    return (
      <Alert
        message="Response send"
        description="Thank you for your response."
        type="success"
        showIcon
        closable
      />
    )
  }

  renderContent() {
    if (this.hasUnrespondedPoll()) {
      return this.renderRespondFormContainer();
    }
    return this.renderWaitingInfo();
  }

  renderRespondFormContainer() {
    const poll = this.props.unrespondedPoll;
    return (
      <RespondFormContainer
        poll={poll}
        onSuccess={this.handleSuccessfulResponse}/>
    )
  }

  renderWaitingInfo() {
    return (
      <Alert
        message="Waiting for next poll..."
        description="There is no active poll at the moment. The next poll will be shown to you here automatically."
        type="info"
        icon={<Icon type="loading-3-quarters" spin />}
        showIcon
      />
    )
  }
}

export default AttendeeScreen;
