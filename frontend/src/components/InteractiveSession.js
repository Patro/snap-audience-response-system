import React, { Component } from 'react';

class InteractiveSession extends Component {
  get attributes() {
    if (this.props.interactiveSession === undefined) {
      return {};
    }
    return this.props.interactiveSession.attributes;
  }

  render() {
    return (
      <div className="InteractiveSession">
        <h1 className="interactive_session__label">{this.attributes.label}</h1>
      </div>
    );
  }
}

export default InteractiveSession;
