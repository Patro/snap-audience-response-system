import React, { Component } from 'react';
import AttendeeScreenContainer from '../containers/AttendeeScreenContainer';

class SessionScreen extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  get session() {
    return this.props.interactiveSession;
  }

  get attributes() {
    return this.session.attributes;
  }

  render() {
    if (this.session === undefined) {
      return <></>;
    }

    return (
      <div className="interactive_session">
        <h1 className="interactive_session__label">{this.attributes.label}</h1>
        <AttendeeScreenContainer interactiveSession={this.session} />
      </div>
    );
  }
}

export default SessionScreen;
