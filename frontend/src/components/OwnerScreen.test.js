import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import factories from '../../__factories__';
import OwnerScreen from './OwnerScreen';
import QuestionFormContainer from './../containers/QuestionFormContainer';
import QuestionListContainer from './../containers/QuestionListContainer';

const session = factories.interactiveSession.entity({
  attributes: {
    attendanceCode: 'ABCD',
  },
});

const setupStore = () => ( configureStore()() );
const mountScreen = ({ location = {} } = {}) => (
  mount(
    <Provider store={setupStore()}>
      <StaticRouter location={location} context={ {} }>
        <OwnerScreen interactiveSession={session} />
      </StaticRouter>
    </Provider>
  )
);

describe('OwnerScreen', () => {
  it('renders attendance code', () => {
    const wrapper = mountScreen();
    expect(wrapper.text()).toContain('ABCD');
  });

  describe('given owner path', () => {
    const location = { pathname: '/interactive_sessions/12/owner' };

    it('renders question list container', () => {
      const wrapper = mountScreen({ location });
      const wrapped = wrapper.find(QuestionListContainer);
      expect(wrapped).toHaveLength(1);
    });
  });

  describe('given new question path', () => {
    const location = {
      pathname: '/interactive_sessions/12/owner/questions/new'
    };

    it('renders question form container', () => {
      const wrapper = mountScreen({ location });
      const wrapped = wrapper.find(QuestionFormContainer);
      expect(wrapped).toHaveLength(1);
    });
  });
});
