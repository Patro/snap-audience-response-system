import React, { Component } from 'react';

class Session extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  get attributes() {
    if (this.props.interactiveSession === undefined) {
      return {};
    }
    return this.props.interactiveSession.attributes;
  }

  render() {
    return (
      <div className="interactive_session">
        <h1 className="interactive_session__label">{this.attributes.label}</h1>
      </div>
    );
  }
}

export default Session;
