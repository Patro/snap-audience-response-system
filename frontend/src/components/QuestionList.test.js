import React from 'react';
import { Button, List } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import QuestionList from './QuestionList';

const session = factories.interactiveSession.entity();
const questions = [
  factories.singleChoiceQuestion.entity({
    attributes: { text: 'Question A' },
  }),
  factories.multipleChoiceQuestion.entity({
    attributes: { text: 'Question B' },
  }),
];

class TestWrapper extends AbstractTestWrapper {
  get listItems() {
    return this.wrapper.find(List.Item);
  }

  get addButton() {
    return this.wrapper.find(Button);
  }

  _render() {
    return mount(this._addStaticRouter(
      <QuestionList {...this.props} />
    ));
  }
}

describe('QuestionList', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper({ props: {
      interactiveSession: session,
    }});
  });

  describe('given questions', () => {
    beforeEach(() => {
      component.props.questions = questions;
    });

    it('renders one list item per question', () => {
      expect(component.listItems).toHaveLength(2);
    });

    it('renders text of question', () => {
      const firstListItem = component.listItems.at(0);
      expect(firstListItem.text()).toEqual('Question A');
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
