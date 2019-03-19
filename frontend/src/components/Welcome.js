import React, { Component } from 'react';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';

class Welcome extends Component {
  render() {
    return (
      <div className="welcome">
        <JoinSessionFormContainer />
      </div>
    );
  }
}

export default Welcome;
