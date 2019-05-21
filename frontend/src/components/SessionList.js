import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import upperFirst from 'lodash/upperFirst';
import { Card, Table } from 'antd';

class SessionList extends Component {
  constructor(props) {
    super(props);

    this.renderLabel = this.renderLabel.bind(this);
  }

  get interactiveSessions() {
    return this.props.interactiveSessions;
  }

  routeFor(interactiveSession) {
    const baseRoute = `/interactive_sessions/${interactiveSession.id}`;
    switch(interactiveSession.attributes.role) {
      case 'owner':
        return `${baseRoute}/owner`;
      default:
        return baseRoute;
    }
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
        render: this.renderLabel,
      },
      {
        title: 'Role',
        dataIndex: 'attributes.role',
        render: upperFirst,
        width: '20%',
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

  renderLabel(text, interactiveSession) {
    return <Link to={this.routeFor(interactiveSession)}>{text}</Link>;
  }
}

export default SessionList;
