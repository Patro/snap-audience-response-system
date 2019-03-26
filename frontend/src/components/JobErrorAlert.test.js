import React from 'react';
import { mount, shallow } from 'enzyme';
import factories from '../../__factories__';
import JobErrorAlert from './JobErrorAlert';

describe('JobErrorAlert', () => {
  describe('given no job', () => {
    it('renders nothing', () => {
      const wrapper = shallow(<JobErrorAlert/>);
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('given successful job', () => {
    const job = factories.job.succeeded();

    it('renders nothing', () => {
      const wrapper = shallow(<JobErrorAlert job={job} />);
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('given failed job with no errors', () => {
    const job = factories.job.failed();

    it('renders generic error message', () => {
      const wrapper = mount(<JobErrorAlert job={job} />);
      expect(wrapper.text()).toContain('Operation failed');
    });
  });

  describe('given failed job with one error', () => {
    const errors = [
      factories.error.unprocessableEntity({ detail: 'firstError' })
    ];
    const job = factories.job.failed({ errors });

    it('renders error message', () => {
      const wrapper = mount(<JobErrorAlert job={job} />);
      expect(wrapper.text()).toContain('firstError');
    });

    describe('when job is set to undefined', () => {
      it('renders error message of initial job', () => {
        const wrapper = mount(<JobErrorAlert job={job} />);
        wrapper.setProps({ job: undefined });
        expect(wrapper.text()).toContain('firstError');
      });
    });

    describe('when job is set to differnt job', () => {
      const otherErrors = [
        factories.error.unprocessableEntity({ detail: 'otherError' })
      ];
      const otherJob = factories.job.failed({ errors: otherErrors });

      it('renders error message of initial job', () => {
        const wrapper = mount(<JobErrorAlert job={job} />);
        wrapper.setProps({ job: otherJob });
        expect(wrapper.text()).toContain('otherError');
      });
    });
  });

  describe('given failed job with multiple errors', () => {
    const errors = [
      factories.error.unprocessableEntity({ detail: 'firstError' }),
      factories.error.unprocessableEntity({ detail: 'secondError' }),
    ];
    const job = factories.job.failed({ errors });

    it('renders error messages', () => {
      const wrapper = mount(<JobErrorAlert job={job} />);
      expect(wrapper.text()).toContain('firstError');
      expect(wrapper.text()).toContain('secondError');
    });
  });
});
