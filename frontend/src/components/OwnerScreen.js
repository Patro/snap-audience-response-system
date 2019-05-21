import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import QuestionFormContainer from './../containers/QuestionFormContainer';
import QuestionListContainer from './../containers/QuestionListContainer';

class OwnerScreen extends Component {
  get session() {
    return this.props.interactiveSession;
  }

  render() {
    return (
      <div className="owner_screen">
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    return (
      <Switch>
        <Route
          path="/interactive_sessions/:id/owner/questions/new"
          component={props => this.renderQuestionForm(props)} />
        <Route
          path="/interactive_sessions/:id/owner/questions/:questionType/:questionId/edit"
          component={props => this.renderQuestionForm(props)} />
        <Route
          component={props => this.renderQuestionList(props)} />
      </Switch>
    );
  }

  renderQuestionForm(routeProps) {
    return (
      <QuestionFormContainer
        interactiveSession={this.session}
        {...routeProps} />
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
