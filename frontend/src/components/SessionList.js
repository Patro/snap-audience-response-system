import React, { Component } from 'react';
import { Card, Table } from 'antd';

class SessionList extends Component {
  get interactiveSessions() {
    return this.props.interactiveSessions;
  }

  render() {
    if (
      this.interactiveSessions === undefined ||
      this.interactiveSessions.isEmpty()
    ) { return false; }

    const columns = [
      {
        title: 'Name',
        dataIndex: 'attributes.label',
      },
    ];

    return (
      <div className="session_list">
        <Card title="My sessions">
          <Table
            bordered
            pagination={false}
            columns={columns}
            dataSource={this.interactiveSessions.toJS()}
            rowKey={session => session.id} />
        </Card>
      </div>
    );
  }
}

export default SessionList;
