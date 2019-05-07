import React, { Component } from 'react';
import { Button } from 'antd';
import PollResultsChartContainer
  from './../containers/PollResultsChartContainer';
import PollsMenu from './PollsMenu';

class QuestionPollsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.selectPoll = this.selectPoll.bind(this);
    this.presentActivePoll = this.presentActivePoll.bind(this);
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
        <PollResultsChartContainer poll={this.activePoll} extra={
          <Button icon="desktop" onClick={this.presentActivePoll}
                  className="question_polls_screen__present_button">
            Present results
          </Button>
        } />
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

  presentActivePoll() {
    const path = `presenter/polls/${this.activePoll.id}`;
    window.open(path, 'presenter', 'status=0');
  }
}

export default QuestionPollsScreen;
