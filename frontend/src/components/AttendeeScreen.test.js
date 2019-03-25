import React from 'react';
import { mount, shallow } from 'enzyme';
import AttendeeScreen from './AttendeeScreen';
import RespondForm from './RespondForm';

describe('AttendeeScreen', () => {
  it('renders without crashing', () => {
    mount(<AttendeeScreen />);
  });

  it('renders respond form', () => {
    const wrapper = shallow(<AttendeeScreen />);
    const form = wrapper.find(RespondForm);
    expect(form.length).toBe(1);
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    shallow(<AttendeeScreen onRefresh={refreshHandler} />);

    expect(refreshHandler).toBeCalled();
  });
});
