import React, { Component } from 'react';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';
import StartSessionFormContainer
  from '../containers/StartSessionFormContainer';

class WelcomeScreen extends Component {
  render() {
    return (
      <div className="welcome">
        <JoinSessionFormContainer />
        <StartSessionFormContainer />
      </div>
    );
  }
}

export default WelcomeScreen;
