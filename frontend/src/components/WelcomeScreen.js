import React, { Component } from 'react';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';

class WelcomeScreen extends Component {
  render() {
    return (
      <div className="welcome">
        <JoinSessionFormContainer />
      </div>
    );
  }
}

export default WelcomeScreen;
