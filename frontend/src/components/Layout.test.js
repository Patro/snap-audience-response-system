import React from 'react';
import { shallow } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import Layout from './Layout';

class TestWrapper extends AbstractTestWrapper {
  get title() {
    return this.wrapper.find('.layout__header_title');
  }

  get titleText() {
    return this.title.text();
  }

  get testChild() {
    return this.wrapper.find('.layout__test_child');
  }

  _render() {
    return shallow(
      <Layout {...this.props}>
        <div className="layout__test_child" />
      </Layout>
    );
  }
}

describe('Layout', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders title', () => {
    component.props.title = 'My Title';
    expect(component.titleText).toContain('My Title');
  });

  it('renders extra', () => {
    component.props.extra = <div className="layout__test_extra" />;
    expect(component.wrapper.find('div.layout__test_extra')).toHaveLength(1);
  });

  it('renders children', () => {
    expect(component.testChild).toHaveLength(1);
  });
});
