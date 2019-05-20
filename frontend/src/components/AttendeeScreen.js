import React, { Component } from 'react';
import { Alert, Icon } from 'antd';
import subscriptions from '../websocket/subscriptions';
import RespondFormContainer from '../containers/RespondFormContainer';

class AttendeeScreen extends Component {
  get interactiveSession() {
    return this.props.interactiveSession;
  }

  get unrespondedPoll() {
    return this.props.unrespondedPoll;
  }

  get hasUnrespondedPoll() {
    return this.unrespondedPoll !== undefined;
  }

  get onRefresh() {
    return this.props.onRefresh;
  }

  render() {
    return (
      <div className="attendee_screen">
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    if (this.hasUnrespondedPoll) {
      return this.renderRespondFormContainer();
    }
    return this.renderWaitingInfo();
  }

  renderRespondFormContainer() {
    return (
      <RespondFormContainer poll={this.unrespondedPoll} />
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

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe() {
    this.subscription = subscriptions.subscribeForPollEvents(
      this.interactiveSession.get('id'),
      (event) => {
        const activePoll = this.unrespondedPoll;
        if (activePoll && activePoll.get('id') !== event.get('pollId')) {
          return;
        }
        this.refresh();
      }
    );
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  refresh() {
    if (this.onRefresh) {
      this.onRefresh();
    }
  }
}

export default AttendeeScreen;
