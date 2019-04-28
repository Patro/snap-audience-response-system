import React from 'react';
import { Button } from 'antd';
import { mount } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import StartPollButton from './StartPollButton';

class TestWrapper extends AbstractTestWrapper {
  get button() {
    return this.wrapper.find(Button).first();
  }

  _render() {
    return mount(
      <StartPollButton {...this.props} />
    )
  }

  click() {
    this.button.simulate('click');
  }
}

describe('StartPollButton', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('on start', () => {
    let onStart;

    beforeEach(() => {
      onStart = jest.fn();
      component.props.onStart = onStart;
    });

    it('calls handler after click on button', () => {
      component.click();
      expect(onStart).toBeCalled();
    });
  });
});
