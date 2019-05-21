import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import SessionList from './SessionList';

class TestWrapper extends AbstractTestWrapper {
  get rows() {
    return this.wrapper.find('TableRow');
  }

  _render() {
    return mount(<SessionList {...this.props} />);
  }
}

describe('SessionList', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('given interactive sessions', () => {
    beforeEach(() => {
      component.props.interactiveSessions = Immutable.List([
        factories.interactiveSession.entity(),
        factories.interactiveSession.entity(),
        factories.interactiveSession.entity(),
      ]);
    });

    it('renders row for every interactive session', () => {
      expect(component.rows).toHaveLength(3);
    });
  });

  describe('given empty interactive sessions list', () => {
    beforeEach(() => {
      component.props.interactiveSessions = Immutable.List();
    });

    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('without interactive sessions list', () => {
    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    });
  });
});
