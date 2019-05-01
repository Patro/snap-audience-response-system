import React from 'react';
import { shallow } from 'enzyme';
import factories from '../../__factories__';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import DeleteButtonContainer from './../containers/DeleteButtonContainer';
import QuestionPollControl from './QuestionPollControl';
import QuestionPollsScreen from './QuestionPollsScreen';
import QuestionListItem from './QuestionListItem';

class TestWrapper extends AbstractTestWrapper {
  get header() {
    return shallow(this.wrapper.prop('header'));
  }

  get extra() {
    return shallow(this.wrapper.prop('extra'));
  }

  get questionText() {
    return this.header.find('.question_list_item__text').text();
  }

  get questionPollControl() {
    return this.extra.find(QuestionPollControl);
  }

  get editButton() {
    return this.extra.find('.question_list__edit_button');
  }

  get deleteButton() {
    return this.extra.find(DeleteButtonContainer);
  }

  get questionPollsScreen() {
    return this.wrapper.find(QuestionPollsScreen);
  }

  _render() {
    return shallow(<QuestionListItem {...this.props} />);
  }
}

describe('QuestionListItem', () => {
  let component;

  beforeEach(() => {
    const question = factories.singleChoiceQuestion.entity({
      attributes: { text: 'Question A' },
    });
    component = new TestWrapper({ props: {
      question: question,
    }});
  });

  it('renders text of question', () => {
    expect(component.questionText).toEqual('Question A');
  });

  it('renders question poll control', () => {
    expect(component.questionPollControl).toHaveLength(1);
  });

  it('renders edit button', () => {
    expect(component.editButton).toHaveLength(1);
  });

  it('renders delete button', () => {
    expect(component.deleteButton).toHaveLength(1);
  });

  it('renders question polls screen', () => {
    expect(component.questionPollsScreen).toHaveLength(1);
  });
});
