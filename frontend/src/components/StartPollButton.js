import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';

class StartPollButton extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  get processing() {
    return this.props.processing;
  }

  get onStart() {
    return this.props.onStart;
  }

  render() {
    return (
      <Tooltip title="Start poll">
        <Button
          icon="caret-right"
          onClick={this.onClick}
          loading={this.processing}
          className="start_poll_button" />
      </Tooltip>
    );
  }

  onClick(event) {
    event.stopPropagation();
    this.onStart();
  }
};

export default StartPollButton;
