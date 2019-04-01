import React, { Component } from 'react';
import { Button, List } from 'antd';

class QuestionList extends Component {
  get questions() {
    return this.props.questions;
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
        <Button type="primary" icon="plus">Add question</Button>
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
}

export default QuestionList;
