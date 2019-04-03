import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import JobErrorAlert from './JobErrorAlert';

class TestWrapper extends AbstractTestWrapper {
  get text() {
    return this.wrapper.text();
  }

  _render() {
    return mount(<JobErrorAlert {...this.props} />)
  }

  setJob(job) {
    this.wrapper.setProps({ job });
  }
}

describe('JobErrorAlert', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  describe('given no job', () => {
    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('given successful job', () => {
    beforeEach(() => {
      component.props.job = factories.job.succeeded();
    });

    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('given failed job with no errors', () => {
    beforeEach(() => {
      component.props.job = factories.job.failed();
    });

    it('renders generic error message', () => {
      expect(component.text).toContain('Operation failed');
    });
  });

  describe('given failed job with one error', () => {
    beforeEach(() => {
      const errors = [
        factories.error.unprocessableEntity({ detail: 'firstError' })
      ];
      component.props.job = factories.job.failed({ errors });
    });

    it('renders error message', () => {
      expect(component.text).toContain('firstError');
    });

    describe('when job is set to undefined', () => {
      it('renders error message of initial job', () => {
        expect(component.text).toContain('firstError');
        component.setJob(undefined);
        expect(component.text).toContain('firstError');
      });
    });

    describe('when job is set to differnt job', () => {
      it('renders error message of new job', () => {
        const otherErrors = [
          factories.error.unprocessableEntity({ detail: 'otherError' })
        ];
        const otherJob = factories.job.failed({ errors: otherErrors });

        expect(component.text).toContain('firstError');
        component.setJob(otherJob);
        expect(component.text).toContain('otherError');
      });
    });
  });

  describe('given failed job with multiple errors', () => {
    beforeEach(() => {
      const errors = [
        factories.error.unprocessableEntity({ detail: 'firstError' }),
        factories.error.unprocessableEntity({ detail: 'secondError' }),
      ];
      component.props.job = factories.job.failed({ errors });
    });

    it('renders error messages', () => {
      expect(component.text).toContain('firstError');
      expect(component.text).toContain('secondError');
    });
  });
});
