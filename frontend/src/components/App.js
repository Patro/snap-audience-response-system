import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import SessionScreenContainer from './../containers/SessionScreenContainer';
import WelcomeScreen from './WelcomeScreen';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" component={WelcomeScreen} />
          <Route path="/interactive_sessions/:id"
                 component={SessionScreenContainer} />
        </Switch>
      </div>
    );
  }
}

export default App;
