import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Collapse } from 'antd';
import QuestionListItem from './QuestionListItem';

class QuestionList extends Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  get interactiveSession() {
    return this.props.interactiveSession;
  }

  get questions() {
    return this.props.questions;
  }

  get openPollsByQuestionId() {
    const openPollsByQuestionId = this.props.openPollsByQuestionId;
    if (openPollsByQuestionId === undefined) { return {}; }

    return openPollsByQuestionId;
  }

  get newQuestionPath() {
    const id = this.interactiveSession.id;
    return `/interactive_sessions/${id}/owner/questions/new`;
  }

  openPollOfQuestion(question) {
    return this.openPollsByQuestionId[question.id];
  }

  render() {
    if (this.questions === undefined) { return false; }

    return (
      <div className="question_list">
        <Card title="Questions" extra={this.renderMenu()}>
          <Collapse>
            {this.questions.map(question => this.renderItem(question))}
          </Collapse>
        </Card>
      </div>
    );
  }

  renderMenu() {
    return (
      <Link to={this.newQuestionPath}>
        <Button
          type="primary"
          icon="plus"
          className="question_list__add_button">Add question</Button>
      </Link>
    )
  }

  renderItem(question) {
    return <QuestionListItem key={question.id}
                             question={question}
                             openPoll={this.openPollOfQuestion(question)} />
  }
}

export default QuestionList;
