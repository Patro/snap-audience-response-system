import React from 'react';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PollResultsChartContainer
  from '../containers/PollResultsChartContainer';
import PresenterScreen from './PresenterScreen';

class TestWrapper extends AbstractTestWrapper {
  get inner() {
    return this.wrapper.dive();
  }

  get pollResultsChart() {
    return this.inner.find(PollResultsChartContainer);
  }

  get givenPoll() {
    return this.pollResultsChart.prop('poll');
  }

  _render() {
    return shallow(
      <PresenterScreen {...this.props} />
    )
  }
}

describe('PresenterScreen', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper({});
  });

  describe('given poll', () => {
    let poll;

    beforeEach(() => {
      poll = factories.poll.entity();
      component.props.poll = poll;
    });

    it('passes poll to results chart', () => {
      expect(component.givenPoll).toEqual(poll);
    });
  });

  describe('without poll', () => {
    it('renders nothing', () => {
      expect(component.inner.isEmptyRender()).toBe(true);
    });
  });

  describe('on mount', () => {
    it('calls on refresh handler', () => {
      const refreshHandler = jest.fn();
      component.props.onRefresh = refreshHandler;

      component.wrapper.dive();

      expect(refreshHandler).toBeCalled();
    });
  });
});
