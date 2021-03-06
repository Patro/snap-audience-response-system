import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Collapse, Tooltip } from 'antd';
import {
  MULTIPLE_CHOICE_QUESTION,
  SINGLE_CHOICE_QUESTION,
} from '../constants/entityTypes';
import DeleteButtonContainer from './../containers/DeleteButtonContainer';
import QuestionPollsScreenContainer
  from './../containers/QuestionPollsScreenContainer';
import QuestionPollControl from './QuestionPollControl';
import './QuestionListItem.css';

class QuestionListItem extends Component {
  constructor(props) {
    super(props);

    this.renderText = this.renderText.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  get question() {
    return this.props.question;
  }

  get questionText() {
    return this.question.getIn(['attributes', 'text']);
  }

  get sessionId() {
    return this.question.getIn(['relationships', 'interactiveSession', 'id']);
  }

  get openPoll() {
    return this.props.openPoll;
  }

  get questionUrlType() {
    switch(this.question.get('type')) {
      case MULTIPLE_CHOICE_QUESTION:
        return 'multiple_choice';
      case SINGLE_CHOICE_QUESTION:
        return 'single_choice';
      default:
        throw new Error('Unsupported question type');
    }
  }

  get editQuestionPath() {
    const ownerPath = `/interactive_sessions/${this.sessionId}/owner`;
    const type = this.questionUrlType;
    const questionIdentifier = `${type}/${this.question.get('id')}`;
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
        {this.questionText}
      </span>
    );
  }

  renderMenu() {
    return (
      <div className="question_list_item__menu">
        <QuestionPollControl
          question={this.question}
          openPoll={this.openPoll} />
        <Link to={this.editQuestionPath}>
          <Tooltip title="Edit question">
            <Button icon="edit" className="question_list__edit_button" />
          </Tooltip>
        </Link>
        <DeleteButtonContainer
          entity={this.question}
          tooltip="Delete question"
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
