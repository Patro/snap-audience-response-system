import Immutable from 'immutable';
import React from 'react';
import { Button, Collapse, Empty } from 'antd';
import { mount } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import QuestionListItem from './QuestionListItem';
import QuestionList from './QuestionList';

class TestWrapper extends AbstractTestWrapper {
  get collapseElement() {
    return this.wrapper.find(Collapse).first();
  }

  get activeQuestionIds() {
    return this.collapseElement.prop('defaultActiveKey');
  }

  get listItems() {
    return this.wrapper.find(QuestionListItem);
  }

  get addButton() {
    return this.wrapper.find(Button).filter('.question_list__add_button');
  }

  get emptyStateMessage() {
    return this.wrapper.find(Empty);
  }

  _render() {
    return mount(this._addStaticRouter(this._addStoreProvider(
      <QuestionList {...this.props} />
    )));
  }

  givenOpenPoll(itemIndex) {
    return this.listItems.at(itemIndex).prop('openPoll');
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

  describe('given two questions', () => {
    beforeEach(() => {
      const questions = Immutable.List([
        factories.singleChoiceQuestion.entity({
          id: '1',
          attributes: { text: 'Question A' },
        }),
        factories.multipleChoiceQuestion.entity({
          id: '2',
          attributes: { text: 'Question B' },
        }),
      ]);
      component.props.questions = questions;
      component.props.openPollsByQuestionId = Immutable.Map();
    });

    it('marks no item as active', () => {
      expect(component.activeQuestionIds).toHaveLength(0);
    });

    it('renders one list item per question', () => {
      expect(component.listItems).toHaveLength(2);
    });

    it('renders button to add new question', () => {
      expect(component.addButton.length).toBe(1);
    });

    it('does not render empty state message', () => {
      expect(component.emptyStateMessage).toHaveLength(0);
    });

    describe('given open poll', () => {
      let poll;

      beforeEach(() => {
        poll = factories.poll.entity();
        const openPollsByQuestionId = Immutable.fromJS({
          1: poll,
        });
        component.props.openPollsByQuestionId = openPollsByQuestionId;
      });

      it('marks item with question id of poll active', () => {
        expect(component.activeQuestionIds).toEqual(['1']);
      });

      it('passes poll to list item', () => {
        expect(component.givenOpenPoll(0)).toBe(poll);
      });
    });
  });

  describe('given empty questions list', () => {
    beforeEach(() => {
      component.props.questions = Immutable.List();
      component.props.openPollsByQuestionId = Immutable.Map();
    });

    it('renders empty state message', () => {
      expect(component.emptyStateMessage).toHaveLength(1);
    });
  });

  describe('without questions', () => {
    beforeEach(() => {
      component.props.openPollsByQuestionId = Immutable.Map();
    });

    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('without open polls', () => {
    beforeEach(() => {
      component.props.questions = Immutable.List();
    });

    it('renders nothing', () => {
      expect(component.wrapper.isEmptyRender()).toBe(true);
    });
  });
});
