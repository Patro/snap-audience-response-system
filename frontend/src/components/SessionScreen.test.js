import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount, shallow } from 'enzyme';
import factories from '../../__factories__';
import SessionScreen from './SessionScreen';
import AttendeeScreenContainer from '../containers/AttendeeScreenContainer';

const session = factories.interactiveSession.entity({
  attributes: { label: 'My Event' },
});

const setupStore = () => ( configureStore()() );

describe('SessionScreen', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={setupStore()}>
        <SessionScreen interactiveSession={session} />
      </Provider>
    )
  });

  it('renders label of session', () => {
    const wrapper = shallow(
      <SessionScreen interactiveSession={session} />
    );
    const label = wrapper.find('.interactive_session__label');
    expect(label.text()).toEqual('My Event');
  });

  it('renders attendee screen container', () => {
    const wrapper = shallow(
      <SessionScreen interactiveSession={session} />
    );
    const wrapped = wrapper.find(AttendeeScreenContainer);
    expect(wrapped).toHaveLength(1);
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    shallow(<SessionScreen onRefresh={refreshHandler} />);

    expect(refreshHandler).toBeCalled();
  });
});
