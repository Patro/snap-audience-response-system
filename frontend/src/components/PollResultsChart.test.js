import React from 'react';
import { shallow } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PollResultsChart from './PollResultsChart';

class TestWrapper extends AbstractTestWrapper {
  _render() {
    return shallow(
      <PollResultsChart {...this.props} />
    )
  }
}

describe('PollResultsChart', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders successful', () => {
    expect(component.wrapper).toHaveLength(1);
  });
});
