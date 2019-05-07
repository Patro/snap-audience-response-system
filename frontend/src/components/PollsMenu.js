import React, { Component } from 'react';
import { Menu } from 'antd';
import ordinal from 'ordinal';
import './PollsMenu.css';

class PollsMenu extends Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  get polls() {
    return this.props.polls;
  }

  get activePoll() {
    return this.props.activePoll;
  }

  get onSelectHandler() {
    return this.props.onSelect;
  }

  get selectedKeys() {
    if (this.activePoll === undefined) { return []; }
    return [this.activePoll.id];
  }

  render() {
    return (
      <div className={`polls_menu ${this.props.className}`}>
        <span className="polls_menu__prefix">Polls:</span>
        <Menu
          mode="horizontal"
          selectedKeys={this.selectedKeys}
          onSelect={this.onSelect}
          className="polls_menu__menu">{this.polls.map(this.renderItem)}</Menu>
      </div>
    );
  }

  renderItem(poll, index) {
    return (
      <Menu.Item key={poll.id} className="polls_menu_item">
        { ordinal(index + 1) }
      </Menu.Item>
    )
  }

  onSelect({ key }) {
    const poll = this.polls.find(poll => poll.id === key);
    this.onSelectHandler(poll);
  }
}

export default PollsMenu;
