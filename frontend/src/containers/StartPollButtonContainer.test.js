import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import { createEntity } from '../actions';
import StartPollButton from '../components/StartPollButton';
import StartPollButtonContainer from './StartPollButtonContainer';

class TestWrapper extends AbstractTestWrapper {
  get startPollButton() {
    return this.wrapper.find(StartPollButton);
  }

  get givenStartPollJob() {
    return this.startPollButton.prop('startPollJob');
  }

  _render() {
    return mount(this._addStoreProvider(
      <StartPollButtonContainer {...this.props} />
    ))
  }

  startPoll() {
    this.startPollButton.props().onStart();
  }
}

describe('StartPollButtonContainer', () => {
  let component, question;

  beforeEach(() => {
    question = factories.singleChoiceQuestion.entity({ id: 964 });
    component = new TestWrapper({
      props: { question },
    });
  });

  describe('start poll job', () => {
    describe('given filled store', () => {
      let job;

      beforeEach(() => {
        const jobId = 'startPollJob:SINGLE_CHOICE_QUESTION:964';
        job = factories.job.started({ id: jobId });
        component.store = {
          jobs: {
            [jobId]: job,
          },
        };
      });

      it('passes job to component', () => {
        expect(component.givenStartPollJob).toEqual(job);
      });
    });

    describe('given empty store', () => {
      beforeEach(() => {
        component.store = {};
      });

      it('passes undefined as job to component', () => {
        expect(component.givenStartPollJob).toBeUndefined();
      });
    });
  });

  describe('on start', () => {
    it('dispatches create entity action', () => {
      component.startPoll();

      const actions = component.store.getActions();
      const expectedPoll = factories.poll.entity({
        attributes: { status: 'open' },
        relationships: { question: { id: question.id, type: question.type } }
      });
      delete expectedPoll.id;
      const expectedAction = createEntity(expectedPoll, expect.anything());
      expect(actions).toContainEqual(expectedAction);
    });
  });
});
