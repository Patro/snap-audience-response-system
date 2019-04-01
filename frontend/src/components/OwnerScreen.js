import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Card } from 'antd';
import QuestionListContainer from './../containers/QuestionListContainer';

class OwnerScreen extends Component {
  get session() {
    return this.props.interactiveSession;
  }

  get attendanceCode() {
    return this.session.attributes.attendanceCode;
  }

  render() {
    return (
      <div className="owner_screen">
        <Card title="Attendance Code">
          { this.attendanceCode }
        </Card>
        {this.renderRoutes()}
      </div>
    );
  }

  renderRoutes() {
    return (
      <Switch>
        <Route component={props => this.renderQuestionList(props)} />
      </Switch>
    );
  }

  renderQuestionList(routeProps) {
    return (
      <QuestionListContainer
        interactiveSession={this.session}
        {...routeProps} />
    );
  }
}

export default OwnerScreen;
