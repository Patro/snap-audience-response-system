import React from 'react';
import { mount } from 'enzyme';
import AttendeeScreen from './AttendeeScreen';

describe('AttendeeScreen', () => {
  it('renders without crashing', () => {
    mount(<AttendeeScreen />);
  });
});
