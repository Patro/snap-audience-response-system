import React from 'react';
import { Button } from 'antd';
import { mount } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import DeleteButton from './DeleteButton';

class TestWrapper extends AbstractTestWrapper {
  get button() {
    return this.wrapper.find(Button).first();
  }

  _render() {
    return mount(
      <DeleteButton {...this.props} />
    )
  }
}

describe('DeleteButton', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders button', () => {
    expect(component.button).toHaveLength(1);
  });
});
