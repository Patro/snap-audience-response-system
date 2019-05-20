import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { joinSession } from '../actions';
import JoinSessionForm from '../components/JoinSessionForm';
import JoinSessionFormContainer from './JoinSessionFormContainer';

class TestWrapper extends AbstractTestWrapper {
  get form() {
    return this.wrapper.find(JoinSessionForm);
  }

  get givenJoinJob() {
    return this.form.prop('joinJob');
  }

  _render() {
    return mount(this._addStoreProvider(
      <JoinSessionFormContainer {...this.props} />
    ))
  }

  submit(attendanceCode) {
    this.form.props().onSubmit(attendanceCode);
  }
}

describe('JoinSessionFormContainer', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('given filled store', () => {
    let job;

    beforeEach(() => {
      job = factories.job.started({ id: 'joinSessionJob' });
      component.store = buildTestState({ jobs: [ job ] });
    });

    it('passes job to component', () => {
      expect(component.givenJoinJob).toEqual(job);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = Immutable.Map();
    });

    it('passes undefined as job to component', () => {
      expect(component.givenJoinJob).toBeUndefined();
    });
  });

  it('dispatches join action on submit', () => {
    component.submit('ABCD');

    const action = component.store.getActions()[0];
    const expectedAction = joinSession('ABCD', 'joinSessionJob');
    expect(action).toMatchObject(expectedAction);
  });
});
