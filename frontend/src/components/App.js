import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import InteractiveSession from './InteractiveSession';
import Welcome from './Welcome';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/interactive_sessions/:id" component={InteractiveSession} />
        </Switch>
      </div>
    );
  }
}

export default App;
