import React from 'react';
import { Button } from 'antd';
import { mount } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import ClosePollButton from './ClosePollButton';

class TestWrapper extends AbstractTestWrapper {
  get button() {
    return this.wrapper.find(Button).first();
  }

  _render() {
    return mount(
      <ClosePollButton {...this.props} />
    )
  }

  click() {
    this.button.simulate('click');
  }
}

describe('ClosePollButton', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('on close', () => {
    let onClose;

    beforeEach(() => {
      onClose = jest.fn();
      component.props.onClose = onClose;
    });

    it('calls handler after click on button', () => {
      component.click();
      expect(onClose).toBeCalled();
    });
  });
});
