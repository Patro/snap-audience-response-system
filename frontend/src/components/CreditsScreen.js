import React, { Component } from 'react';
import { Card } from 'antd';
import Layout from './Layout';

class CreditsScreen extends Component {
  render() {
    return (
      <div className="credits_screen">
        <Layout>
          <Card title="Credits">
            <h3>Application Logo</h3>
            <a href="https://thenounproject.com/term/snap/55532/"
              target="_blank"
              rel="noopener noreferrer">snap</a> by Chris Dawson
            from the Noun Project
          </Card>
        </Layout>
      </div>
    );
  }
}

export default CreditsScreen;
