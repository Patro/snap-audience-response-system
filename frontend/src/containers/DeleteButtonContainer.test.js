import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
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
    entity = { type: 'SPACESHIP', id: '12' };
    component = new TestWrapper({
      props: { entity },
    });
  });

  describe('given filled store', () => {
    let job;

    beforeEach(() => {
      job = factories.job.started({ id: 'destroyJob:SPACESHIP:12' });
      component.store = {
        jobs: {
          'destroyJob:SPACESHIP:12': job,
        },
      };
    });

    it('passes job to component', () => {
      expect(component.givenDeleteJob).toEqual(job);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = {};
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
