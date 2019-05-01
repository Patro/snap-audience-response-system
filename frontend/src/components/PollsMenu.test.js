import React from 'react';
import { shallow } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PollsMenu from './PollResultsChart';

class TestWrapper extends AbstractTestWrapper {
  _render() {
    return shallow(
      <PollsMenu {...this.props} />
    )
  }
}

describe('PollsMenu', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders successful', () => {
    expect(component.wrapper).toHaveLength(1);
  });
});
