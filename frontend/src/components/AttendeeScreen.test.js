import React from 'react';
import { mount, shallow } from 'enzyme';
import AttendeeScreen from './AttendeeScreen';

describe('AttendeeScreen', () => {
  it('renders without crashing', () => {
    mount(<AttendeeScreen />);
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    shallow(<AttendeeScreen onRefresh={refreshHandler} />);

    expect(refreshHandler).toBeCalled();
  });
});
