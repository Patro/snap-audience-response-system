import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Welcome from './Welcome';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Welcome} />
        </Switch>
      </div>
    );
  }
}

export default App;
