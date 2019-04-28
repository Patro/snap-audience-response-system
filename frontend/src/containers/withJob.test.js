import React from 'react';
import { shallow } from 'enzyme'
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import withJob from './withJob';

const WrappedComponent = class extends React.Component {
  render() {
    return <div></div>;
  }
}
const ExtendedComponent = withJob(props => props.job)(WrappedComponent);

class TestWrapper extends AbstractTestWrapper {
  get wrappedComponent() {
    return this.wrapper.find(WrappedComponent).first();
  }

  get givenProcessingFlag() {
    return this.wrappedComponent.prop('processing');
  }

  _render() {
    return shallow(<ExtendedComponent {...this.props} />);
  }

  updateJob(job) {
    this.wrapper.setProps({ job });
  }

  triggerTransitionFromNoneToStarted() {
    this.props.job = undefined;
    this.updateJob(factories.job.started());
  }

  triggerTransitionFromStartedToSucceeded() {
    this.props.job = factories.job.started();
    this.updateJob(factories.job.succeeded());
  }

  triggerTransitionFormStartedToFailed() {
    this.props.job = factories.job.started();
    this.updateJob(factories.job.failed());
  }
}

describe('withJob', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders wrapped component', () => {
    expect(component.wrappedComponent).toHaveLength(1);
  });

  describe('processing flag', () => {
    describe('given started job', () => {
      beforeEach(() => {
        component.props.job = factories.job.started();
      });

      it('sets flag to true', () => {
        expect(component.givenProcessingFlag).toBe(true);
      });
    });

    describe('given succeeded job', () => {
      beforeEach(() => {
        component.props.job = factories.job.succeeded();
      });

      it('sets flag to false', () => {
        expect(component.givenProcessingFlag).toBe(false);
      });
    });

    describe('given failed job', () => {
      beforeEach(() => {
        component.props.job = factories.job.failed();
      });

      it('sets flag to false', () => {
        expect(component.givenProcessingFlag).toBe(false);
      });
    });

    describe('without job', () => {
      it('sets flag to false', () => {
        expect(component.givenProcessingFlag).toBe(false);
      });
    });
  });

  describe('on success handler', () => {
    let onSuccess;

    beforeEach(() => {
      onSuccess = jest.fn();
      component.props.onSuccess = onSuccess;
    });

    describe('transition from none to started job', () => {
      beforeEach(() => {
        component.triggerTransitionFromNoneToStarted();
      });

      it('does not call handler', () => {
        expect(onSuccess).not.toBeCalled();
      });
    });

    describe('transition from started to succeeded job', () => {
      beforeEach(() => {
        component.triggerTransitionFromStartedToSucceeded();
      });

      it('calls handler', () => {
        expect(onSuccess).toBeCalled();
      });
    });

    describe('transition from started to failed job', () => {
      beforeEach(() => {
        component.triggerTransitionFormStartedToFailed();
      });

      it('does not call handler', () => {
        expect(onSuccess).not.toBeCalled();
      });
    });

    describe('when handler is undefined', () => {
      beforeEach(() => {
        component.props.onSuccess = undefined;
      });

      it('does not fail', () => {
        expect(() => {
          component.triggerTransitionFromStartedToSucceeded();
        }).not.toThrow();
      });
    });
  });
});
