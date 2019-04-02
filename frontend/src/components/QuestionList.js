import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, List } from 'antd';

class QuestionList extends Component {
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
          <Button type="primary" icon="plus">Add question</Button>
        </Link>
      </>
    )
  }

  renderQuestion(question) {
    return (
      <List.Item key={question.id}>
        {question.attributes.text}
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
