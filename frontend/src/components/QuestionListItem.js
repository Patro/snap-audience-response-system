import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Collapse } from 'antd';
import {
  MULTIPLE_CHOICE_QUESTION,
  SINGLE_CHOICE_QUESTION,
} from '../constants/entityTypes';
import DeleteButtonContainer from './../containers/DeleteButtonContainer';
import QuestionPollsScreenContainer
  from './../containers/QuestionPollsScreenContainer';
import QuestionPollControl from './QuestionPollControl';

class QuestionListItem extends Component {
  constructor(props) {
    super(props);

    this.renderText = this.renderText.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  get question() {
    return this.props.question;
  }

  get openPoll() {
    return this.props.openPoll;
  }

  get questionUrlType() {
    switch(this.question.type) {
      case MULTIPLE_CHOICE_QUESTION:
        return 'multiple_choice';
      case SINGLE_CHOICE_QUESTION:
        return 'single_choice';
      default:
        throw new Error('Unsupported question type');
    }
  }

  get editQuestionPath() {
    const sessionId = this.question.relationships.interactiveSession.id;
    const ownerPath = `/interactive_sessions/${sessionId}/owner`;
    const type = this.questionUrlType;
    const questionIdentifier = `${type}/${this.question.id}`;
    return `${ownerPath}/questions/${questionIdentifier}/edit`;
  }

  render() {
    if (this.question === undefined) { return false; }

    return (
      <Collapse.Panel
        {...this.props}
        header={this.renderText()}
        extra={this.renderMenu()}
        className="question_list_item">{this.renderContent()}</Collapse.Panel>
    );
  }

  renderText() {
    return (
      <span className="question_list_item__text">
        {this.question.attributes.text}
      </span>
    );
  }

  renderMenu() {
    return (
      <div>
        <QuestionPollControl
          question={this.question}
          openPoll={this.openPoll}
          className="question_list__poll_control" />
        <Link to={this.editQuestionPath}>
          <Button
            type="primary"
            icon="edit"
            className="question_list__edit_button" />
        </Link>
        <DeleteButtonContainer
          entity={this.question}
          confirmMessage="Are you sure to delete this question?"
          className="question_list__delete_button" />
      </div>
    );
  }

  renderContent() {
    return <QuestionPollsScreenContainer question={this.question} />;
  }
}

export default QuestionListItem;
