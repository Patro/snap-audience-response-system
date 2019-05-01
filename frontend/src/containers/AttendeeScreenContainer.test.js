import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import { fetchCollection } from '../actions';
import { POLL, INTERACTIVE_SESSION } from '../constants/entityTypes';
import AttendeeScreen from '../components/AttendeeScreen';
import AttendeeScreenContainer from './AttendeeScreenContainer';

class TestWrapper extends AbstractTestWrapper {
  get attendeeScreen() {
    return this.wrapper.find(AttendeeScreen);
  }

  get givenUnrespondedPoll() {
    return this.attendeeScreen.prop('unrespondedPoll');
  }

  _render() {
    return mount(this._addStoreProvider(
      <AttendeeScreenContainer {...this.props} />
    ))
  }

  refresh() {
    this.attendeeScreen.props().onRefresh();
  }
}

describe('AttendeeScreenContainer', () => {
  let session;
  let component;

  beforeEach(() => {
    session = factories.interactiveSession.entity({ id: '100' });
    component = new TestWrapper({ props: {
      interactiveSession: session,
    }});
  });

  describe('given filled store', () => {
    let poll;
    beforeEach(() => {
      poll = factories.poll.entity({ id: '100' });
      const collection = factories.poll.collectionWithIds(['100']);

      const filter =
        '{"interactiveSessionId":"100","status":"open","responded":false}'
      const filledStore = {
        entities: {
          [INTERACTIVE_SESSION]: { '100': session },
          [POLL]: { '100': poll },
        },
        collections: {
          [POLL]: { [filter]: collection },
        },
      };
      component.store = filledStore;
    });

    it('passes first poll to component', () => {
      expect(component.givenUnrespondedPoll).toEqual(poll);
    });
  });

  describe('given empty store', () => {
    beforeEach(() => {
      component.store = {};
    });

    it('passes undefined as poll to component', () => {
      expect(component.givenUnrespondedPoll).toBeUndefined();
    });
  });

  it('dispatches fetch collection action on refresh', () => {
    component.refresh();

    const action = component.store.getActions().slice(-1)[0];
    const expectedAction = fetchCollection(POLL, {
      interactiveSessionId: '100',
      status: 'open',
      responded: false
    }, expect.anything());
    expect(action).toMatchObject(expectedAction);
  });
});
