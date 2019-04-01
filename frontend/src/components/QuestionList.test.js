import React from 'react';
import { Button, List } from 'antd';
import { mount, shallow } from 'enzyme';
import factories from '../../__factories__';
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

const getListItems = (wrapper) => (
  wrapper.find(List.Item)
);

describe('QuestionList', () => {
  describe('given questions', () => {
    it('renders one list item per question', () => {
      const wrapper = mount(
        <QuestionList interactiveSession={session} questions={questions} />
      );
      const listItems = getListItems(wrapper);
      expect(listItems).toHaveLength(2);
    });

    it('renders text of question', () => {
      const wrapper = mount(
        <QuestionList interactiveSession={session} questions={questions} />
      );
      const firstListItem = getListItems(wrapper).at(0);
      expect(firstListItem.text()).toEqual('Question A');
    });

    it('renders button to add new question', () => {
      const wrapper = mount(
        <QuestionList interactiveSession={session} questions={questions} />
      );
      const button = wrapper.find(Button);
      expect(button.length).toBe(1);
    });
  });

  describe('without questions', () => {
    it('renders nothing', () => {
      const wrapper = shallow(<QuestionList interactiveSession={session} />);
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });

  it('calls on refresh handler on mount', () => {
    const refreshHandler = jest.fn();
    shallow(
      <QuestionList interactiveSession={session} onRefresh={refreshHandler} />
    );

    expect(refreshHandler).toBeCalled();
  });
});
