import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import { updateEntity } from '../actions';
import ClosePollButton from '../components/ClosePollButton';
import ClosePollButtonContainer from './ClosePollButtonContainer';

class TestWrapper extends AbstractTestWrapper {
  get closePollButton() {
    return this.wrapper.find(ClosePollButton);
  }

  get givenClosePollJob() {
    return this.closePollButton.prop('closePollJob');
  }

  _render() {
    return mount(this._addStoreProvider(
      <ClosePollButtonContainer {...this.props} />
    ))
  }

  closePoll() {
    this.closePollButton.props().onClose();
  }
}

describe('ClosePollButtonContainer', () => {
  let component, poll;

  beforeEach(() => {
    poll = factories.poll.entity({ id: '791' });
    component = new TestWrapper({
      props: { poll },
    });
  });

  describe('close poll job', () => {
    describe('given filled store', () => {
      let job;

      beforeEach(() => {
        const jobId = 'closePollJob:POLL:791';
        job = factories.job.started({ id: jobId });
        component.store = {
          jobs: {
            [jobId]: job,
          },
        };
      });

      it('passes job to component', () => {
        expect(component.givenClosePollJob).toEqual(job);
      });
    });

    describe('given empty store', () => {
      beforeEach(() => {
        component.store = {};
      });

      it('passes undefined as job to component', () => {
        expect(component.givenClosePollJob).toBeUndefined();
      });
    });
  });

  describe('on close', () => {
    it('dispatches update entity action', () => {
      component.closePoll();

      const actions = component.store.getActions();
      const expectedPoll = {
        ...poll,
        attributes: { status: 'closed' },
      };
      const expectedAction = updateEntity(expectedPoll, expect.anything());
      expect(actions).toContainEqual(expectedAction);
    });
  });
});
