import React from 'react';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import OwnerScreen from './OwnerScreen';
import QuestionFormContainer from './../containers/QuestionFormContainer';
import QuestionListContainer from './../containers/QuestionListContainer';

class TestWrapper extends AbstractTestWrapper {
  get questionForm() {
    return this.wrapper.find(QuestionFormContainer).first();
  }

  get givenQuestionTypeOfForm() {
    return this.questionForm.props().match.params.questionType;
  }

  get givenQuestionIdOfForm() {
    return this.questionForm.props().match.params.questionId;
  }

  get questionList() {
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

  setEditQuestionPath() {
    this.location = {
      pathname: '/interactive_sessions/12/owner/questions/multiple_choice/1/edit'
    };
  }
}

describe('OwnerScreen', () => {
  let component;

  beforeEach(() => {
    const session = factories.interactiveSession.entity();
    component = new TestWrapper({ props: {
      interactiveSession: session,
    } });
  });

  describe('given owner path', () => {
    beforeEach(() => {
      component.setOwnerPath();
    });

    it('renders question list', () => {
      expect(component.questionList).toHaveLength(1);
    });
  });

  describe('given new question path', () => {
    beforeEach(() => {
      component.setNewQuestionPath();
    });

    it('renders question form', () => {
      expect(component.questionForm).toHaveLength(1);
    });
  });

  describe('given edit question path', () => {
    beforeEach(() => {
      component.setEditQuestionPath();
    });

    it('renders question form', () => {
      expect(component.questionForm).toHaveLength(1);
    });

    it('passes question type to form', () => {
      expect(component.givenQuestionTypeOfForm).toBe('multiple_choice');
    });

    it('passes question id to form', () => {
      expect(component.givenQuestionIdOfForm).toBe('1');
    });
  });
});
