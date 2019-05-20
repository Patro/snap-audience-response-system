import React, { Component } from 'react';
import { Button, Modal, Tooltip } from 'antd';

class DeleteButton extends Component {
  constructor(props) {
    super(props);

    this.showConfirmationModal = this.showConfirmationModal.bind(this);
    this.delete = this.delete.bind(this);
  }

  get buttonProps() {
    return {
      className: this.props.className,
    };
  }

  get processing() {
    return this.props.processing;
  }

  get onDelete() {
    return this.props.onDelete;
  }

  get tooltip() {
    return this.props.tooltip;
  }

  render() {
    if (this.tooltip === undefined) { return this.renderButton(); }

    return (
      <Tooltip title={this.tooltip}>
        {this.renderButton()}
      </Tooltip>
    )
  }

  renderButton() {
    return (
      <Button
        { ...this.buttonProps }
        type="danger"
        icon="delete"
        onClick={this.showConfirmationModal}
        loading={this.processing} />
    );
  }

  showConfirmationModal(event) {
    event.stopPropagation();

    this.modal = Modal.confirm({
      title: this.props.confirmMessage,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: this.delete,
    });
  }

  delete() {
    this.modal.destroy();
    this.onDelete();
  }
};

export default DeleteButton;
