import Immutable from 'immutable';
import React from 'react';
import { Menu } from 'antd';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import PollsMenu from './PollsMenu';

class TestWrapper extends AbstractTestWrapper {
  get menu() {
    return this.wrapper.find(Menu).first();
  }

  get items() {
    return this.wrapper.find(Menu.Item);
  }

  get selectedKeys() {
    return this.menu.prop('selectedKeys');
  }

  _render() {
    return shallow(
      <PollsMenu {...this.props} />
    )
  }

  selectPoll(id) {
    this.menu.simulate('select', { key: id });
  }
}

describe('PollsMenu', () => {
  let polls, component;

  beforeEach(() => {
    polls = Immutable.List([
      factories.poll.entity({ id: '100' }),
      factories.poll.entity({ id: '101' })
    ]);
    component = new TestWrapper({ props: { polls } });
  });

  it('renders item for every poll', () => {
    expect(component.items).toHaveLength(2);
  });

  describe('given second poll as active poll', () => {
    beforeEach(() => {
      component.props.activePoll = polls.get(1);
    });

    it('selects second poll', () => {
      expect(component.selectedKeys).toEqual(['101']);
    });
  })

  describe('on select', () => {
    it('calls on select handler', () => {
      const onSelect = jest.fn();
      component.props.onSelect = onSelect;

      component.selectPoll('100');

      expect(onSelect).toBeCalledWith(polls.get(0));
    });
  });
});
