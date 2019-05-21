import React, { Component } from 'react';
import { Row, Col } from 'antd';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';
import StartSessionFormContainer
  from '../containers/StartSessionFormContainer';
import Layout from './Layout';
import SessionList from './SessionList';
import './WelcomeScreen.css';

class WelcomeScreen extends Component {
  render() {
    const formColConfig = { xs: 24, md: 12 };
    return (
      <div className="welcome_screen">
        <Layout>
          <Row className="welcome_screen__session_list_row">
            <Col>
              <SessionList />
            </Col>
          </Row>
          <Row className="welcome_screen__form_row">
            <Col {...formColConfig} className="welcome_screen__form_col">
              <JoinSessionFormContainer />
            </Col>
            <Col {...formColConfig} className="welcome_screen__form_col">
              <StartSessionFormContainer />
            </Col>
          </Row>
        </Layout>
      </div>
    );
  }
}

export default WelcomeScreen;
