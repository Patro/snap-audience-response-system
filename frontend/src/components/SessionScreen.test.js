import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import { mount, shallow } from 'enzyme';
import SessionScreen from './SessionScreen';
import AttendeeScreenContainer from '../containers/AttendeeScreenContainer';

const setupStore = () => ( configureStore()() );
const setupSession = () => ( { id: 100, attributes: { label: 'My Event'} } );

describe('SessionScreen', () => {
  it('renders without crashing', () => {
    mount(
      <Provider store={setupStore()}>
        <SessionScreen interactiveSession={setupSession()} />
      </Provider>
    )
  });

  it('renders label of session', () => {
    const wrapper = shallow(
      <SessionScreen interactiveSession={setupSession()} />
    );
    const label = wrapper.find('.interactive_session__label');
    expect(label.text()).toEqual('My Event');
  });

  it('renders attendee screen container', () => {
    const wrapper = shallow(
      <SessionScreen interactiveSession={setupSession()} />
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
