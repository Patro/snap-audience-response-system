import React, { Component } from 'react';
import { Progress } from 'antd';

class PollResultsChartItem extends Component {
  get poll() {
    return this.props.poll;
  }

  get questionOption() {
    return this.props.questionOption;
  }

  get questionOptionCount() {
    return this.props.questionOptionCount;
  }

  get numberOfRespondents() {
    return this.poll.attributes.numberOfRespondents;
  }

  get numberOfResponses() {
    return this.questionOptionCount.attributes.numberOfResponses;
  }

  get percent() {
    return parseFloat(this.numberOfResponses) / this.numberOfRespondents * 100;
  }

  render() {
    if (this.questionOption === undefined) { return false; }

    return (
      <div className="poll_results_chart_item">
        <span className="poll_results_chart_item__option_text">
          {this.questionOption.attributes.text}
        </span>
        <Progress
          percent={this.percent}
          format={percent => `${percent}%`}
          status="normal" />
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
}

export default PollResultsChartItem;
