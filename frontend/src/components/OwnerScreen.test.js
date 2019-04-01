import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import OwnerScreen from './OwnerScreen';
import QuestionList from './QuestionList';

const session = factories.interactiveSession.entity({
  attributes: {
    attendanceCode: 'ABCD',
  },
});

const mountScreen = ({ location = {} } = {}) => (
  mount(
    <StaticRouter location={location} context={ {} }>
      <OwnerScreen interactiveSession={session} />
    </StaticRouter>
  )
);

describe('OwnerScreen', () => {
  it('renders attendance code', () => {
    const wrapper = mountScreen();
    expect(wrapper.text()).toContain('ABCD');
  });

  describe('given owner path', () => {
    const location = { pathname: '/interactive_sessions/12/owner' };

    it('renders question list', () => {
      const wrapper = mountScreen({ location });
      const wrapped = wrapper.find(QuestionList);
      expect(wrapped).toHaveLength(1);
    });
  });
});
