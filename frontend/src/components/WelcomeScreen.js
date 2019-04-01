import React, { Component } from 'react';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';
import StartSessionForm from './StartSessionForm';

class WelcomeScreen extends Component {
  render() {
    return (
      <div className="welcome">
        <JoinSessionFormContainer />
        <StartSessionForm />
      </div>
    );
  }
}

export default WelcomeScreen;
