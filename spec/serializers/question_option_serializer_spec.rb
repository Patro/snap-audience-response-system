# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionSerializer do
  let(:question) { create(:single_choice_question) }
  let(:question_option) do
    create(:question_option, question: question, text: '42', correct: true)
  end
  let(:serializer) do
    QuestionOptionSerializer.new(
      question_option,
      params: { current_user: create(:user) }
    )
  end
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it 'should serialize id' do
      is_expected.to include(id: "#{question_option.id}")
    end

    it 'should serialize type' do
      is_expected.to include(type: :question_option)
    end

    describe 'attributes' do
      subject { data[:attributes] }

      it 'should serialize text' do
        is_expected.to include(text: '42')
      end

      context 'given policy with show correct flag set to true' do
        it 'should serialize correct flag' do
          allow_any_instance_of(QuestionOptionPolicy)
          .to receive(:show_correct_flag?)
          .and_return(true)

          is_expected.to include(correct: true)
        end
      end

      context 'given policy with show correct flag set to false' do
        it 'should not serialize correct flag' do
          allow_any_instance_of(QuestionOptionPolicy)
          .to receive(:show_correct_flag?)
          .and_return(false)

          is_expected.not_to include(:correct)
        end
      end
    end

    describe 'relationships' do
      describe 'question' do
        subject { data[:relationships][:question][:data] }

        it 'should serialize id' do
          is_expected.to include(id: question.id.to_s)
        end

        it 'should serialize type' do
          is_expected.to include(type: :single_choice_question)
        end
      end
    end
  end
end
