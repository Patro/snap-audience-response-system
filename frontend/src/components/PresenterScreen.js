import React, { Component } from 'react';
import { Button } from 'antd';
import PollResultsChartContainer
  from '../containers/PollResultsChartContainer';
import withFullscreenStatus from './withFullscreenStatus';

class PresenterScreen extends Component {
  get poll() {
    return this.props.poll;
  }

  get showFullscreenButton() {
    return !this.props.shownFullscreen;
  }

  render() {
    if (this.poll === undefined) { return false; }

    return (
      <div className="presenter_screen">
        <PollResultsChartContainer poll={this.poll}
                                   extra={this.renderFullscreenButton()} />
      </div>
    );
  }

  renderFullscreenButton() {
    if (!this.showFullscreenButton) { return false; }

    return <Button onClick={this.showFullscreen}>Show full screen</Button>;
  }

  showFullscreen() {
    document.documentElement.requestFullscreen();
  }
}

export default withFullscreenStatus(PresenterScreen);
