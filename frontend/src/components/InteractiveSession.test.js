import React from 'react';
import { mount, shallow } from 'enzyme';
import InteractiveSession from './InteractiveSession';

describe('InteractiveSession', () => {
  it('renders without crashing', () => {
    mount(<InteractiveSession />);
  });

  it('renders label of interactive session', () => {
    const interactiveSession = { attributes: { label: 'My Event'} };
    const wrapper = shallow(
      <InteractiveSession interactiveSession={interactiveSession} />
    );
    const label = wrapper.find('.interactive_session__label');
    expect(label.text()).toEqual('My Event');
  });
});
