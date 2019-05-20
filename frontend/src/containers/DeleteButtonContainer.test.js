import Immutable from 'immutable';
import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import buildTestState from '../utils/buildTestState';
import { destroyEntity } from '../actions';
import DeleteButton from '../components/DeleteButton';
import DeleteButtonContainer from './DeleteButtonContainer';

class TestWrapper extends AbstractTestWrapper {
  get deleteButton() {
    return this.wrapper.find(DeleteButton);
  }

  get givenDeleteJob() {
    return this.deleteButton.prop('deleteJob');
  }

  _render() {
    return mount(this._addStoreProvider(
      <DeleteButtonContainer {...this.props} />
    ))
  }

  delete() {
    this.deleteButton.props().onDelete();
  }
}

describe('DeleteButtonContainer', () => {
  let component, entity;

  beforeEach(() => {
    entity = Immutable.fromJS({ type: 'SPACESHIP', id: '12' });
    component = new TestWrapper({
      props: { entity },
    });
  });

  describe('given filled store', () => {
    let job;

    beforeEach(() => {
      job = factories.job.started({ id: 'destroyJob:SPACESHIP:12' });
      component.store = buildTestState({ jobs: [ job ] });
    });

    it('passes job to component', () => {
      expect(component.givenDeleteJob).toEqual(job);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = Immutable.Map();
    });

    it('passes undefined as job to component', () => {
      expect(component.givenDeleteJob).toBeUndefined();
    });
  });

  it('dispatches destory entity action on delete', () => {
    component.delete();

    const action = component.store.getActions().slice(-1)[0];
    const expectedAction = destroyEntity(entity, 'destroyJob:SPACESHIP:12');
    expect(action).toMatchObject(expectedAction);
  });
});
