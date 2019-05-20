import React, { Component } from 'react';
import { Card } from 'antd';
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

  get questionText() {
    return this.question.getIn(['attributes', 'text']);
  }

  get questionOptionCounts() {
    return this.props.questionOptionCounts;
  }

  get onRefresh() {
    return this.props.onRefresh;
  }

  get extra() {
    return this.props.extra;
  }

  render() {
    if (this.question === undefined) { return false; }
    if (this.questionOptionCounts === undefined) { return false; }

    return (
      <div className="poll_results_chart">
        <Card title={this.questionText} extra={this.extra}>
          {this.questionOptionCounts.map(count => this.renderItem(count))}
        </Card>
      </div>
    );
  }

  renderItem(questionOptionCount) {
    return (
      <PollResultsChartItemContainer
        key={questionOptionCount.get('id')}
        poll={this.poll}
        questionOptionCount={questionOptionCount} />
    )
  }

  componentDidMount() {
    this.subscribe();
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
      this.question.getIn(['relationships', 'interactiveSession', 'id']),
      this.poll.get('id'),
      () => this.refresh(),
    );
  }

  unsubscribe() {
    if (this.subscription === undefined) { return; }

    this.subscription.unsubscribe();
  }

  refresh() {
    if (this.onRefresh) {
      this.onRefresh();
    }
  }
}

export default PollResultsChart;
