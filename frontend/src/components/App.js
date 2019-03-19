import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import InteractiveSessionContainer
  from './../containers/InteractiveSessionContainer';
import Welcome from './Welcome';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/interactive_sessions/:id"
                 component={InteractiveSessionContainer} />
        </Switch>
      </div>
    );
  }
}

export default App;
