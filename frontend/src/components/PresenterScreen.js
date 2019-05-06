import React, { Component } from 'react';
import PollResultsChartContainer
  from '../containers/PollResultsChartContainer';

class PresenterScreen extends Component {
  get poll() {
    return this.props.poll;
  }

  render() {
    if (this.poll === undefined) { return false; }

    return (
      <div className="presenter_screen">
        <PollResultsChartContainer poll={this.poll} />
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

export default PresenterScreen;
