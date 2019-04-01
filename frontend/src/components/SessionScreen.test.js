import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import factories from '../../__factories__';
import SessionScreen from './SessionScreen';
import AttendeeScreenContainer from '../containers/AttendeeScreenContainer';
import OwnerScreen from './OwnerScreen';

const session = factories.interactiveSession.entity({
  attributes: { label: 'My Event' },
});

const setupStore = () => ( configureStore()() );
const mountScreen = ({ store, location = {}, props = {} }) => (
  mount(
    <Provider store={store}>
      <StaticRouter location={location} context={ { match: { url: '' } } }>
        <SessionScreen interactiveSession={session} {...props} />
      </StaticRouter>
    </Provider>
  )
);

describe('SessionScreen', () => {
  it('renders without crashing', () => {
    mountScreen({ store: setupStore() })
  });

  it('renders label of session', () => {
    const wrapper = mountScreen({ store: setupStore() });
    const label = wrapper.find('.interactive_session__label');
    expect(label.text()).toEqual('My Event');
  });

  describe('given attendee path', () => {
    const location = { pathname: '/interactive_sessions/12' };

    it('renders attendee screen container', () => {
      const wrapper = mountScreen({ store: setupStore(), location })

      const wrapped = wrapper.find(AttendeeScreenContainer);
      expect(wrapped).toHaveLength(1);
    });
  });

  describe('given owner path', () => {
    const location = { pathname: '/interactive_sessions/12/owner' };

    it('renders owner screen', () => {
      const wrapper = mountScreen({ store: setupStore(), location })

      const wrapped = wrapper.find(OwnerScreen);
      expect(wrapped).toHaveLength(1);
    });
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    mountScreen({ store: setupStore(), props: {
      onRefresh: refreshHandler
    }})

    expect(refreshHandler).toBeCalled();
  });
});
