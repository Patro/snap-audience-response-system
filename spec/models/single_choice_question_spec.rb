# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SingleChoiceQuestion, type: :model do
  describe '#instance_of' do
    context 'given question' do
      let(:question) { create(:single_choice_question) }
      subject { Question.find(question.id) }

      it 'should be instance of single choice question' do
        is_expected.to be_instance_of(SingleChoiceQuestion)
      end
    end
  end
end
