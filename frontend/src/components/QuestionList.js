import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Collapse, Empty } from 'antd';
import QuestionListItem from './QuestionListItem';

class QuestionList extends Component {
  get interactiveSession() {
    return this.props.interactiveSession;
  }

  get questions() {
    return this.props.questions;
  }

  get openPollsByQuestionId() {
    return this.props.openPollsByQuestionId;
  }

  get questionIdsWithOpenPoll() {
    return this.openPollsByQuestionId.keySeq();
  }

  get newQuestionPath() {
    const id = this.interactiveSession.get('id');
    return `/interactive_sessions/${id}/owner/questions/new`;
  }

  openPollOfQuestion(question) {
    return this.openPollsByQuestionId.get(question.get('id'));
  }

  render() {
    if (
      this.questions === undefined || this.openPollsByQuestionId === undefined
    ) { return false; }

    return (
      <div className="question_list">
        <Card title="Questions" extra={this.renderMenu()}>
          {this.renderContent()}
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

  renderContent() {
    if (this.questions.count() > 0) {
      return this.renderCollapse();
    }
    else {
      return this.renderEmptyStateMessage();
    }
  }

  renderCollapse() {
    return (
      <Collapse defaultActiveKey={this.questionIdsWithOpenPoll.toJS()}>
        {this.questions.map(question => this.renderCollapseItem(question))}
      </Collapse>
    )
  }

  renderCollapseItem(question) {
    return <QuestionListItem key={question.get('id')}
                             question={question}
                             openPoll={this.openPollOfQuestion(question)} />
  }

  renderEmptyStateMessage() {
    return <Empty description="There are no questions for this session yet." />;
  }
}

export default QuestionList;
