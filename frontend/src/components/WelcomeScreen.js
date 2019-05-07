import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';
import StartSessionFormContainer
  from '../containers/StartSessionFormContainer';
import Layout from './Layout';
import './WelcomeScreen.css';

class WelcomeScreen extends Component {
  render() {
    return (
      <div className="welcome_screen">
        <Layout>
          {this.renderContent()}
        </Layout>
      </div>
    );
  }

  renderContent() {
    const colConfig = { xs: 24, md: 12 };
    return (
      <Row className="welcome_screen__row">
        <Col {...colConfig} className="welcome_screen__column">
          {this.renderJoinCard()}
        </Col>
        <Col {...colConfig} className="welcome_screen__column">
          {this.renderStartCard()}
        </Col>
      </Row>
    )
  }

  renderJoinCard() {
    const title = "Join running session";
    return (
      <Card title={title} className="welcome_screen__card">
        <JoinSessionFormContainer />
      </Card>
    )
  }

  renderStartCard() {
    const title = "Start your own session";
    return (
      <Card title={title} className="welcome_screen__card">
        <StartSessionFormContainer />
      </Card>
    )
  }
}

export default WelcomeScreen;
