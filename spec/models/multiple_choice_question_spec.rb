# frozen_string_literal: true

require 'rails_helper'

RSpec.describe MultipleChoiceQuestion, type: :model do
  describe '#instance_of' do
    context 'given question' do
      let(:question) { create(:multiple_choice_question) }
      subject { Question.find(question.id) }

      it 'should be instance of multiple choice question' do
        is_expected.to be_instance_of(MultipleChoiceQuestion)
      end
    end
  end
end
