import React from 'react';
import { mount, shallow } from 'enzyme';
import factories from '../../__factories__';
import AttendeeScreen from './AttendeeScreen';
import RespondFormContainer from '../containers/RespondFormContainer';

describe('AttendeeScreen', () => {
  it('renders without crashing', () => {
    mount(<AttendeeScreen />);
  });

  it('renders respond form container', () => {
    const poll = factories.poll.entity();
    const wrapper = shallow(<AttendeeScreen unrespondedPoll={poll} />);
    const form = wrapper.find(RespondFormContainer);
    expect(form.length).toBe(1);
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    shallow(<AttendeeScreen onRefresh={refreshHandler} />);

    expect(refreshHandler).toBeCalled();
  });
});
