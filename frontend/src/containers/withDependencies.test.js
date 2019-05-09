import React from 'react';
import { shallow } from 'enzyme'
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import withDependencies from './withDependencies';

const WrappedComponent = class extends React.Component {
  render() {
    return <div></div>;
  }
}

class TestWrapper extends AbstractTestWrapper {
  get wrappedComponent() {
    return this.wrapper.find(WrappedComponent).first();
  }

  _render() {
    const Component = withDependencies(this.shouldRefresh)(WrappedComponent);
    return shallow(<Component {...this.props} />);
  }

  updateRelated(related) {
    this.wrapper.setProps({ related });
  }

  updateUnrelated(unrelated) {
    this.wrapper.setProps({ unrelated });
  }
}

describe('withDependencies', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders wrapped component', () => {
    expect(component.wrappedComponent).toHaveLength(1);
  });

  describe('on refresh handler', () => {
    let onRefresh;

    beforeEach(() => {
      onRefresh = jest.fn();
      component.props.onRefresh = onRefresh;
    });

    describe('on mount', () => {
      it('does call handler', () => {
        component.render();

        expect(onRefresh).toBeCalled();
      });
    });

    describe('given function that return true', () => {
      beforeEach(() => {
        component.shouldRefresh = () => true;
      });

      it('calls handler', () => {
        component.render();
        onRefresh.mockClear();
        component.updateRelated({})

        expect(onRefresh).toBeCalled();
      });
    });

    describe('change of unrelated prop', () => {
      beforeEach(() => {
        component.shouldRefresh = () => false;
      });

      it('does not call handler', () => {
        component.render();
        onRefresh.mockClear();
        component.updateUnrelated({})

        expect(onRefresh).not.toBeCalled();
      });
    });
  });
});
