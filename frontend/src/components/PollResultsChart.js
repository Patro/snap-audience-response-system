import React, { Component } from 'react';
import subscriptions from '../websocket/subscriptions';
import PollResultsChartItemContainer
  from '../containers/PollResultsChartItemContainer';

class PollResultsChart extends Component {
  get poll() {
    return this.props.poll;
  }

  get question() {
    return this.props.question;
  }

  get questionOptionCounts() {
    return this.props.questionOptionCounts;
  }

  render() {
    if (this.question === undefined) { return false; }
    if (this.questionOptionCounts === undefined) { return false; }

    return (
      <div className="poll_results_chart">
        <h1 className="poll_results_chart__question_text">
          {this.question.attributes.text}
        </h1>
        {this.questionOptionCounts.map(count => this.renderItem(count))}
      </div>
    );
  }

  renderItem(questionOptionCount) {
    return (
      <PollResultsChartItemContainer
        key={questionOptionCount.id}
        poll={this.poll}
        questionOptionCount={questionOptionCount} />
    )
  }

  componentDidMount() {
    this.subscribe();
    this.refresh();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.poll !== this.poll || prevProps.question !== this.question) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  subscribe() {
    if (this.question === undefined) { return; }

    this.subscription = subscriptions.subscribeForResponseEvents(
      this.question.relationships.interactiveSession.id,
      this.poll.id,
      () => this.refresh(),
    );
  }

  unsubscribe() {
    if (this.subscription === undefined) { return; }

    this.subscription.unsubscribe();
  }

  refresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }
}

export default PollResultsChart;
