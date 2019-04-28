import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, List } from 'antd';
import {
  MULTIPLE_CHOICE_QUESTION,
  SINGLE_CHOICE_QUESTION,
} from '../constants/entityTypes';
import DeleteButtonContainer from './../containers/DeleteButtonContainer';

class QuestionListItem extends Component {
  get question() {
    return this.props.question;
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

  get onDelete() {
    return this.props.onDelete;
  }

  render() {
    return (
      <List.Item key={this.question.id} className="question_list_item">
        <span className="question_list_item__text">
          {this.question.attributes.text}
        </span>
        <Link to={this.editQuestionPath}>
          <Button
            type="primary"
            icon="edit"
            className="question_list__edit_button" />
        </Link>
        <DeleteButtonContainer
          entity={this.question}
          confirmMessage="Are you sure to delete this question?"
          onSuccess={this.onDelete}
          className="question_list__delete_button" />
      </List.Item>
    )
  }
}

export default QuestionListItem;
