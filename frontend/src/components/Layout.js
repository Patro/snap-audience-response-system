import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout as AntDLayout, Row, Col } from 'antd';
import logo from '../images/logo.png';
import logoIcon from '../images/logoIcon.png';
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
            <Row>
              {this.renderLogo()}
              {this.renderExtra()}
              <Col>
                <h1 className="layout__header_title">{this.title}</h1>
              </Col>
            </Row>
          </div>
        </AntDLayout.Header>
        <AntDLayout.Content className="layout__content">
          <div className="layout__content_wrapper">
            {this.props.children}
          </div>
        </AntDLayout.Content>
        <AntDLayout.Footer className="layout__footer">
          <a href="https://patrickrompf.de/imprint.html"
             target="_blank"
             rel="noopener noreferrer"
             className="layout__footer_item">Imprint</a>
          |
          <Link to="/credits" className="layout__footer_item">Credits</Link>
        </AntDLayout.Footer>
      </AntDLayout>
    );
  }

  renderExtra() {
    if (this.extra === undefined) { return false; }

    return (
      <Col className="layout__header_extra">
        {this.extra}
      </Col>
    )
  }

  renderLogo() {
    if (this.title === undefined) {
      return (
        <Col className="layout__header_logo">
          <img src={logo} alt="Logo" />
        </Col>
      )
    }

    return (
      <>
        <Col className="layout__header_logo_icon" sm={{span: 0}}>
          <img src={logoIcon} alt="Logo" />
        </Col>
        <Col className="layout__header_logo" xs={{span: 0}} sm={{span: 1}}>
          <img src={logo} alt="Logo" />
        </Col>
      </>
    )
  }
}

export default Layout;
