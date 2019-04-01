import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import AttendeeScreenContainer from '../containers/AttendeeScreenContainer';
import OwnerScreen from './OwnerScreen';

class SessionScreen extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  get session() {
    return this.props.interactiveSession;
  }

  get attributes() {
    return this.session.attributes;
  }

  render() {
    if (this.session === undefined) { return false; }

    return (
      <div className="interactive_session">
        <h1 className="interactive_session__label">{this.attributes.label}</h1>
        {this.renderRoutes()}
      </div>
    );
  }

  renderRoutes() {
    return (
      <Switch>
        <Route
          path="/interactive_sessions/:id/owner"
          component={props => this.renderOwnerScreen(props)} />
        <Route
          component={props => this.renderAttendeeScreen(props)} />
      </Switch>
    );
  }

  renderOwnerScreen(routeProps) {
    return (
      <OwnerScreen interactiveSession={this.session} {...routeProps} />
    );
  }

  renderAttendeeScreen(routeProps) {
    return (
      <AttendeeScreenContainer
        interactiveSession={this.session}
        {...routeProps} />
    );
  }
}

export default SessionScreen;
