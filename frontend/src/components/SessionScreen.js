import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import AttendeeScreenContainer from '../containers/AttendeeScreenContainer';
import PresenterScreenContainer from '../containers/PresenterScreenContainer';
import AttendanceCodeTag from './AttendanceCodeTag';
import Layout from './Layout';
import OwnerScreen from './OwnerScreen';
import './SessionScreen.css';

class SessionScreen extends Component {
  get session() {
    return this.props.interactiveSession;
  }

  get attributes() {
    return this.session.get('attributes');
  }

  get label() {
    return this.attributes.get('label');
  }

  get attendanceCode() {
    return this.attributes.get('attendanceCode');
  }

  render() {
    if (this.session === undefined) { return false; }

    return (
      <div className="session_screen">
        <Layout title={this.label} extra={this.renderAttendanceCode()}>
          {this.renderRoutes()}
        </Layout>
      </div>
    );
  }

  renderAttendanceCode() {
    if (this.attendanceCode === undefined) { return false; }

    return (
      <AttendanceCodeTag attendanceCode={this.attendanceCode} />
    )
  }

  renderRoutes() {
    return (
      <Switch>
        <Route
          path="/interactive_sessions/:id/owner"
          component={props => this.renderOwnerScreen(props)} />
        <Route
          path="/interactive_sessions/:id/presenter/polls/:pollId"
          component={props => this.renderPresenterScreen(props)} />
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

  renderPresenterScreen(routeProps) {
    return (
      <PresenterScreenContainer
        interactiveSession={this.session}
        {...routeProps} />
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
