import React, { Component } from 'react';
import { Progress } from 'antd';

class PollResultsChartItem extends Component {
  get poll() {
    return this.props.poll;
  }

  get questionOption() {
    return this.props.questionOption;
  }

  get questionOptionText() {
    return this.questionOption.getIn(['attributes', 'text']);
  }

  get questionOptionCount() {
    return this.props.questionOptionCount;
  }

  get numberOfRespondents() {
    return this.poll.getIn(['attributes', 'numberOfRespondents']);
  }

  get numberOfResponses() {
    return this.questionOptionCount.getIn(['attributes', 'numberOfResponses']);
  }

  get percent() {
    const raw = parseFloat(this.numberOfResponses) / this.numberOfRespondents * 100;
    return Math.round(raw);
  }

  render() {
    if (this.questionOption === undefined) { return false; }

    return (
      <div className="poll_results_chart_item">
        <span className="poll_results_chart_item__option_text">
          {this.questionOptionText}
        </span>
        <Progress
          percent={this.percent}
          format={percent => `${percent}%`}
          status="normal" />
      </div>
    );
  }
}

export default PollResultsChartItem;
