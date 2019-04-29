import React, { Component } from 'react';
import { Button } from 'antd';

class ClosePollButton extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  get processing() {
    return this.props.processing;
  }

  get onClose() {
    return this.props.onClose;
  }

  render() {
    return (
      <Button
        icon="pause"
        onClick={this.onClick}
        loading={this.processing}
        className="close_poll_button" />
    );
  }

  onClick(event) {
    event.stopPropagation();
    this.onClose();
  }
};

export default ClosePollButton;
