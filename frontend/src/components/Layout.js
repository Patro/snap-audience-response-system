import React, { Component } from 'react';
import { Layout as AntDLayout } from 'antd';
import './Layout.css'

class Layout extends Component {
  get title() {
    return this.props.title;
  }

  get extra() {
    return this.props.extra;
  }

  render() {
    return (
      <AntDLayout className="layout">
        <AntDLayout.Header className="layout__header">
          <div className="layout__header_content_wrapper">
            {this.renderExtra()}
            <h1 className="layout__header_title">{this.title}</h1>
          </div>
        </AntDLayout.Header>
        <AntDLayout.Content className="layout__content">
          <div className="layout__content_wrapper">
            {this.props.children}
          </div>
        </AntDLayout.Content>
      </AntDLayout>
    );
  }

  renderExtra() {
    if (this.extra === undefined) { return false; }

    return (
      <div className="layout__header_extra">{this.extra}</div>
    )
  }
}

export default Layout;
