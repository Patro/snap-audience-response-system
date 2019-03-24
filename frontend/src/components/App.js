import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import SessionContainer
  from './../containers/SessionContainer';
import Welcome from './Welcome';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/interactive_sessions/:id"
                 component={SessionContainer} />
        </Switch>
      </div>
    );
  }
}

export default App;
