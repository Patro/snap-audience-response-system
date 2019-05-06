import React from 'react';
import { mount } from 'enzyme'
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import withFullscreenStatus from './withFullscreenStatus';

const WrappedComponent = class extends React.Component {
  render() {
    return <div></div>;
  }
}
const ExtendedComponent = withFullscreenStatus(WrappedComponent);

class TestWrapper extends AbstractTestWrapper {
  get wrappedComponent() {
    return this.wrapper.find(WrappedComponent).first();
  }

  get givenFullscreenFlag() {
    return this.wrappedComponent.prop('shownFullscreen');
  }

  _render() {
    return mount(<ExtendedComponent {...this.props} />);
  }
}

describe('withFullscreenStatus', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('given document element as fullscreen element', () => {
    it('sets fullscreen flag to true', () => {
      window.document.fullscreenElement = window.document.documentElement;

      expect(component.givenFullscreenFlag).toEqual(true);

      delete window.document.fullscreenElement;
    });
  });

  describe('without fullscreen element', () => {
    it('sets fullscreen flag to false', () => {
      expect(component.givenFullscreenFlag).toEqual(false);
    });
  });

  describe('on fullscreen change', () => {
    it('updates fullscreen flag', () => {
      component._render();

      window.document.fullscreenElement = window.document.documentElement;
      window.document.dispatchEvent(new Event('fullscreenchange'));

      expect(component.givenFullscreenFlag).toEqual(true);

      delete window.document.fullscreenElement;
    });
  });
});
