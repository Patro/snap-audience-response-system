import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, List } from 'antd';
import {
  MULTIPLE_CHOICE_QUESTION,
  SINGLE_CHOICE_QUESTION,
} from '../constants/entityTypes';
import DeleteButtonContainer from './../containers/DeleteButtonContainer';

class QuestionList extends Component {
  constructor(props) {
    super(props);

    this.renderQuestion = this.renderQuestion.bind(this);
  }

  get interactiveSession() {
    return this.props.interactiveSession;
  }

  get questions() {
    return this.props.questions;
  }

  get newQuestionPath() {
    const id = this.interactiveSession.id;
    return `/interactive_sessions/${id}/owner/questions/new`;
  }

  questionUrlType(question) {
    switch(question.type) {
      case MULTIPLE_CHOICE_QUESTION:
        return 'multiple_choice';
      case SINGLE_CHOICE_QUESTION:
        return 'single_choice';
      default:
        throw new Error('Unsupported question type');
    }
  }

  editQuestionPath(question) {
    const sessionId = this.interactiveSession.id;
    const ownerPath = `/interactive_sessions/${sessionId}/owner`;
    const type = this.questionUrlType(question);
    const questionIdentifier = `${type}/${question.id}`;
    return `${ownerPath}/questions/${questionIdentifier}/edit`;
  }

  render() {
    if (this.questions === undefined) { return false; }

    return (
      <div className="question_list">
        <List
            header={this.renderHeader()}
            bordered
            dataSource={this.questions}
            renderItem={this.renderQuestion} />
      </div>
    );
  }

  renderHeader() {
    return (
      <>
        <span>Questions</span>
        <Link to={this.newQuestionPath}>
          <Button
            type="primary"
            icon="plus"
            className="question_list__add_button">Add question</Button>
        </Link>
      </>
    )
  }

  renderQuestion(question) {
    return (
      <List.Item key={question.id}>
        {question.attributes.text}
        <Link to={this.editQuestionPath(question)}>
          <Button
            type="primary"
            icon="edit"
            className="question_list__edit_button" />
        </Link>
        <DeleteButtonContainer
          entity={question}
          confirmMessage="Are you sure to delete this question?"
          className="question_list__delete_button" />
      </List.Item>
    )
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }
}

export default QuestionList;
