import React, { Component } from 'react';
import { Row, Col } from 'antd';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';
import StartSessionFormContainer
  from '../containers/StartSessionFormContainer';
import Layout from './Layout';
import './WelcomeScreen.css';

class WelcomeScreen extends Component {
  render() {
    const colConfig = { xs: 24, md: 12 };
    return (
      <div className="welcome_screen">
        <Layout>
          <Row className="welcome_screen__row">
            <Col {...colConfig} className="welcome_screen__column">
              <JoinSessionFormContainer />
            </Col>
            <Col {...colConfig} className="welcome_screen__column">
              <StartSessionFormContainer />
            </Col>
          </Row>
        </Layout>
      </div>
    );
  }
}

export default WelcomeScreen;
