import Immutable from 'immutable';
import React from 'react';
import { Empty } from 'antd';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PollResultsChartContainer
  from './../containers/PollResultsChartContainer';
import PollsMenu from './PollsMenu';
import QuestionPollsScreen from './QuestionPollsScreen';

class TestWrapper extends AbstractTestWrapper {
  get pollsMenu() {
    return this.wrapper.find(PollsMenu).first();
  }

  get pollResultsChart() {
    return this.wrapper.find(PollResultsChartContainer).first();
  }

  get emptyStateMessage() {
    return this.wrapper.find(Empty);
  }

  get givenPollsOfMenu() {
    return this.pollsMenu.prop('polls');
  }

  get givenActivePollOfMenu() {
    return this.pollsMenu.prop('activePoll');
  }

  get givenPollToShowResultsFor() {
    return this.pollResultsChart.prop('poll');
  }

  _render() {
    return shallow(
      <QuestionPollsScreen {...this.props} />
    )
  }

  selectPoll(poll) {
    this.pollsMenu.simulate('select', poll);
  }
}

describe('QuestionPollsScreen', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('given multiple closed polls', () => {
    let closedPolls;

    beforeEach(() => {
      closedPolls = Immutable.fromJS([
        factories.poll.entity({ attributes: { status: 'closed' } }),
        factories.poll.entity({ attributes: { status: 'closed' } }),
      ]);
      component.props.polls = closedPolls;
    });

    it('passes all closed polls to menu', () => {
      expect(component.givenPollsOfMenu).toEqual(closedPolls);
    });

    it('selects last poll in menu', () => {
      expect(component.givenActivePollOfMenu).toEqual(closedPolls.get(1));
    });

    it('shows results of last poll', () => {
      expect(component.givenPollToShowResultsFor).toEqual(closedPolls.get(1));
    });

    it('does not render empty state message', () => {
      expect(component.emptyStateMessage).toHaveLength(0);
    });

    describe('on select of first closed poll', () => {
      beforeEach(() => {
        component.selectPoll(closedPolls.get(0));
      });

      it('selects first poll in menu', () => {
        expect(component.givenActivePollOfMenu).toEqual(closedPolls.get(0));
      });

      it('shows results of first poll', () => {
        expect(component.givenPollToShowResultsFor).toEqual(closedPolls.get(0));
      });
    });
  });

  describe('given one open and one closed poll', () => {
    let openPoll, closedPoll;

    beforeEach(() => {
      openPoll = factories.poll.entity({ attributes: { status: 'open' } });
      closedPoll = factories.poll.entity({ attributes: { status: 'closed' } });
      component.props.polls = Immutable.fromJS([openPoll, closedPoll]);
    });

    it('passes open and closed poll to menu', () => {
      expect(component.givenPollsOfMenu).toEqual(
        Immutable.fromJS([openPoll, closedPoll])
      );
    });

    it('selects open poll in menu', () => {
      expect(component.givenActivePollOfMenu).toEqual(openPoll);
    });

    it('shows results of open poll', () => {
      expect(component.givenPollToShowResultsFor).toEqual(openPoll);
    });

    it('does not render empty state message', () => {
      expect(component.emptyStateMessage).toHaveLength(0);
    });

    describe('on select of closed poll', () => {
      beforeEach(() => {
        component.selectPoll(closedPoll);
      });

      it('selects closed poll in menu', () => {
        expect(component.givenActivePollOfMenu).toEqual(closedPoll);
      });

      it('shows results of closed poll', () => {
        expect(component.givenPollToShowResultsFor).toEqual(closedPoll);
      });
    });
  });

  describe('given empty polls list', () => {
    beforeEach(() => {
      component.props.polls = Immutable.List();
    });

    it('does not render polls menu', () => {
      expect(component.pollsMenu).toHaveLength(0);
    });

    it('does not render results chart', () => {
      expect(component.pollResultsChart).toHaveLength(0);
    });

    it('renders empty state message', () => {
      expect(component.emptyStateMessage).toHaveLength(1);
    });
  });

  describe('without polls', () => {
    it('does not render polls menu', () => {
      expect(component.pollsMenu).toHaveLength(0);
    });

    it('does not render results chart', () => {
      expect(component.pollResultsChart).toHaveLength(0);
    });
  });
});
