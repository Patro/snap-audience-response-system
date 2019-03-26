import React from 'react';
import { mount, shallow } from 'enzyme';
import { Alert } from 'antd';
import factories from '../../__factories__';
import AttendeeScreen from './AttendeeScreen';
import RespondFormContainer from '../containers/RespondFormContainer';

describe('AttendeeScreen', () => {
  it('renders without crashing', () => {
    mount(<AttendeeScreen />);
  });

  describe('without unresponded poll', () => {
    it('renders waiting info', () => {
      const wrapper = shallow(<AttendeeScreen  />);
      const alert = wrapper.find(Alert).render();
      expect(alert.text()).toContain('Waiting');
    });
  });

  describe('given unresponded poll', () => {
    const poll = factories.poll.entity();

    it('renders respond form container', () => {
      const wrapper = shallow(<AttendeeScreen unrespondedPoll={poll} />);
      const form = wrapper.find(RespondFormContainer);
      expect(form.length).toBe(1);
    });

    describe('when user responded to poll', () => {
      const simulateResponse = (wrapper) => {
        const form = wrapper.find(RespondFormContainer);
        form.simulate('success');
      };

      it('shows thank you message', () => {
        const wrapper = shallow(<AttendeeScreen unrespondedPoll={poll} />);
        simulateResponse(wrapper);

        const alert = wrapper.find(Alert).render();
        expect(alert.text()).toContain('Thank you');
      });

      it('calls on refresh handler', () => {
        const refreshHandler = jest.fn();

        const wrapper = shallow(
          <AttendeeScreen unrespondedPoll={poll} onRefresh={refreshHandler} />
        );
        simulateResponse(wrapper);

        expect(refreshHandler).toBeCalled();
      });
    });
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    shallow(<AttendeeScreen onRefresh={refreshHandler} />);

    expect(refreshHandler).toBeCalled();
  });
});
