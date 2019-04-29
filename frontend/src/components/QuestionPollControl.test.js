import React from 'react';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import ClosePollButtonContainer from './../containers/ClosePollButtonContainer';
import StartPollButtonContainer from './../containers/StartPollButtonContainer';
import QuestionPollControl from './QuestionPollControl';

class TestWrapper extends AbstractTestWrapper {
  get closePollButtonContainer() {
    return this.wrapper.find(ClosePollButtonContainer);
  }

  get startPollButtonContainer() {
    return this.wrapper.find(StartPollButtonContainer);
  }

  _render() {
    return shallow(
      <QuestionPollControl {...this.props} />
    )
  }
}

describe('QuestionPollControl', () => {
  let component;

  beforeEach(() => {
    const question = factories.singleChoiceQuestion.entity();
    component = new TestWrapper({ props: { question } });
  });

  describe('without open poll', () => {
    it('renders start poll button container', () => {
      expect(component.startPollButtonContainer).toHaveLength(1);
    });

    it('does not render close poll button container', () => {
      expect(component.closePollButtonContainer).toHaveLength(0);
    });
  });

  describe('given open poll', () => {
    beforeEach(() => {
      const poll = factories.poll.entity();
      component.props.openPoll = poll;
    });

    it('renders close poll button container', () => {
      expect(component.closePollButtonContainer).toHaveLength(1);
    });

    it('does not render start poll button container', () => {
      expect(component.startPollButtonContainer).toHaveLength(0);
    });
  });
});
