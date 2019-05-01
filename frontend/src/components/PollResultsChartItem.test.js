import React from 'react';
import { shallow } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PollResultsChartItem from './PollResultsChartItem';

class TestWrapper extends AbstractTestWrapper {
  _render() {
    return shallow(
      <PollResultsChartItem {...this.props} />
    )
  }
}

describe('PollResultsChartItem', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders successful', () => {
    expect(component.wrapper).toHaveLength(1);
  });
});
