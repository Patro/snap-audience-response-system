import React from 'react';
import { shallow } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PresenterScreen from './PresenterScreen';

class TestWrapper extends AbstractTestWrapper {
  _render() {
    return shallow(
      <PresenterScreen {...this.props} />
    )
  }
}

describe('PresenterScreen', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders wrapper', () => {
    expect(component.wrapper).toHaveLength(1);
  });
});
