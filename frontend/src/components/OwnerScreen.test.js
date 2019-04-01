import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import OwnerScreen from './OwnerScreen';

const session = factories.interactiveSession.entity({
  attributes: {
    attendanceCode: 'ABCD',
  },
});

describe('OwnerScreen', () => {
  it('renders attendance code', () => {
    const wrapper = mount(<OwnerScreen interactiveSession={session} />);
    expect(wrapper.text()).toContain('ABCD');
  });
});
