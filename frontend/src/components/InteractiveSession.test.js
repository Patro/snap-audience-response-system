import React from 'react';
import { mount } from 'enzyme';
import InteractiveSession from './InteractiveSession';

describe('InteractiveSession', () => {
  it('renders without crashing', () => {
    mount(<InteractiveSession />);
  });
});
