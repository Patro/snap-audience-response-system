import React, { Component } from 'react';
import ClosePollButtonContainer from './../containers/ClosePollButtonContainer';
import StartPollButtonContainer from './../containers/StartPollButtonContainer';

class QuestionPollControl extends Component {
  get question() {
    return this.props.question;
  }

  get openPoll() {
    return this.props.openPoll;
  }

  render() {
    if (this.openPoll === undefined) {
      return <StartPollButtonContainer question={this.question} />
    }
    else {
      return <ClosePollButtonContainer question={this.question}
                                       poll={this.openPoll} />
    }
  }
};

export default QuestionPollControl;
