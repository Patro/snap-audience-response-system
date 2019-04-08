import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import { startSession } from '../actions';
import StartSessionForm from '../components/StartSessionForm';
import StartSessionFormContainer from './StartSessionFormContainer';

class TestWrapper extends AbstractTestWrapper {
  get form() {
    return this.wrapper.find(StartSessionForm);
  }

  get providedStartJob() {
    return this.form.prop('startJob');
  }

  _render() {
    return mount(this._addStoreProvider(
      <StartSessionFormContainer {...this.props} />
    ));
  }

  submit(label) {
    this.form.props().onSubmit(label);
  }
}

describe('StartSessionFormContainer', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('given filled store', () => {
    let job;

    beforeEach(() => {
      job = factories.job.started({ id: 'startSessionJob' });
      component.store = {
        jobs: {
          'startSessionJob': job,
        },
      };
    });

    it('passes job to component', () => {
      expect(component.providedStartJob).toEqual(job);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = {};
    });

    it('passes undefined as job to component', () => {
      expect(component.providedStartJob).toBeUndefined();
    });
  });

  it('dispatches start action on submit', () => {
    component.submit('My Super Session');

    const action = component.store.getActions()[0];
    const expectedAction = startSession('My Super Session', 'startSessionJob');
    expect(action).toMatchObject(expectedAction);
  });
});
