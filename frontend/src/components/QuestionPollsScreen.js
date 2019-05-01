import React, { Component } from 'react';
import PollsMenu from './PollsMenu';
import PollResultsChart from './PollResultsChart';

class QuestionPollsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.selectPoll = this.selectPoll.bind(this);
  }

  get polls() {
    return this.props.polls;
  }

  get openPolls() {
    return this.polls.filter(poll => poll.attributes.status === 'open');
  }

  get activePoll() {
    if (this.state.activePoll !== undefined) {
      return this.state.activePoll;
    }
    else if (this.openPolls.length > 0) {
      return this.openPolls[this.openPolls.length - 1];
    }
    else {
      return this.polls[this.polls.length - 1]
    }
  }

  render() {
    if (this.polls === undefined || this.polls.length === 0) { return false; }

    return (
      <div className="question_polls_screen">
        <PollsMenu polls={this.polls}
                   activePoll={this.activePoll}
                   onSelect={this.selectPoll} />
        <PollResultsChart poll={this.activePoll} />
      </div>
    );
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  selectPoll(poll) {
    this.setState({ activePoll: poll });
  }
}

export default QuestionPollsScreen;
