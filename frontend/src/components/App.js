import React, { Component } from 'react';
import './App.css';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <JoinSessionFormContainer />
      </div>
    );
  }
}

export default App;
