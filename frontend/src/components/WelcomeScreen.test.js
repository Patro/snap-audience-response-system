import React from 'react';
import { shallow } from 'enzyme'
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import JoinSessionFormContainer from '../containers/JoinSessionFormContainer';
import StartSessionFormContainer
  from '../containers/StartSessionFormContainer';
import SessionList from './SessionList';
import WelcomeScreen from './WelcomeScreen';

class TestWrapper extends AbstractTestWrapper {
  get joinSessionFormContainer() {
    return this.wrapper.find(JoinSessionFormContainer);
  }

  get startSessionFormContainer() {
    return this.wrapper.find(StartSessionFormContainer);
  }

  get sessionList() {
    return this.wrapper.find(SessionList);
  }

  _render() {
    return shallow(<WelcomeScreen {...this.props} />)
  }
}

describe('WelcomeScreen', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper();
  });

  it('renders join form container', () => {
    expect(component.joinSessionFormContainer).toHaveLength(1);
  });

  it('renders start session form container', () => {
    expect(component.startSessionFormContainer).toHaveLength(1);
  });

  it('renders session list', () => {
    expect(component.sessionList).toHaveLength(1);
  });
});
