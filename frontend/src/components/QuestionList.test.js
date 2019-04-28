import React from 'react';
import { Button } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import QuestionListItem from './QuestionListItem';
import QuestionList from './QuestionList';

class TestWrapper extends AbstractTestWrapper {
  get listItems() {
    return this.wrapper.find(QuestionListItem);
  }

  get addButton() {
    return this.wrapper.find(Button).filter('.question_list__add_button');
  }

  _render() {
    return mount(this._addStaticRouter(this._addStoreProvider(
      <QuestionList {...this.props} />
    )));
  }
}

describe('QuestionList', () => {
  let component;

  beforeEach(() => {
    const session = factories.interactiveSession.entity();
    component = new TestWrapper({ props: {
      interactiveSession: session,
    }});
  });

  describe('given questions', () => {
    beforeEach(() => {
      const questions = [
        factories.singleChoiceQuestion.entity({
          attributes: { text: 'Question A' },
        }),
        factories.multipleChoiceQuestion.entity({
          attributes: { text: 'Question B' },
        }),
      ];
      component.props.questions = questions;
    });

    it('renders one list item per question', () => {
      expect(component.listItems).toHaveLength(2);
    });

    it('renders button to add new question', () => {
      expect(component.addButton.length).toBe(1);
    });
  });

  describe('without questions', () => {
    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('on mount', () => {
    it('calls on refresh handler', () => {
      const refreshHandler = jest.fn();
      component.props.onRefresh = refreshHandler;

      component._render();

      expect(refreshHandler).toBeCalled();
    });
  });
});
