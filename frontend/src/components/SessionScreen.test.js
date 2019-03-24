import React from 'react';
import { mount, shallow } from 'enzyme';
import SessionScreen from './SessionScreen';

describe('SessionScreen', () => {
  it('renders without crashing', () => {
    mount(<SessionScreen />);
  });

  it('renders label of session', () => {
    const interactiveSession = { attributes: { label: 'My Event'} };
    const wrapper = shallow(
      <SessionScreen interactiveSession={interactiveSession} />
    );
    const label = wrapper.find('.interactive_session__label');
    expect(label.text()).toEqual('My Event');
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    shallow(<SessionScreen onRefresh={refreshHandler} />);

    expect(refreshHandler).toBeCalled();
  });
});
