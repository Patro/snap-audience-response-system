import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import OwnerScreen from './OwnerScreen';
import QuestionFormContainer from './../containers/QuestionFormContainer';
import QuestionListContainer from './../containers/QuestionListContainer';

class TestWrapper extends AbstractTestWrapper {
  get text() {
    return this.wrapper.text();
  }

  get questionFormContainer() {
    return this.wrapper.find(QuestionFormContainer).first();
  }

  get questionListContainer() {
    return this.wrapper.find(QuestionListContainer).first();
  }

  _render() {
    return mount(this._addStoreProvider(this._addStaticRouter(
      <OwnerScreen {...this.props} />
    )))
  }

  setOwnerPath() {
    this.location = { pathname: '/interactive_sessions/12/owner' };
  }

  setNewQuestionPath() {
    this.location = {
      pathname: '/interactive_sessions/12/owner/questions/new'
    };
  }
}

describe('OwnerScreen', () => {
  let component;

  beforeEach(() => {
    const session = factories.interactiveSession.entity({
      attributes: {
        attendanceCode: 'ABCD',
      },
    });
    component = new TestWrapper({ props: {
      interactiveSession: session,
    } });
  });

  it('renders attendance code', () => {
    expect(component.text).toContain('ABCD');
  });

  describe('given owner path', () => {
    beforeEach(() => {
      component.setOwnerPath();
    });

    it('renders question list container', () => {
      expect(component.questionListContainer).toHaveLength(1);
    });
  });

  describe('given new question path', () => {
    beforeEach(() => {
      component.setNewQuestionPath();
    });

    it('renders question form container', () => {
      expect(component.questionFormContainer).toHaveLength(1);
    });
  });
});
