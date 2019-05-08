# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionOptionSerializer do
  let(:question) { create(:single_choice_question) }
  let(:question_option) do
    create(:question_option, question: question,
                             text: '42',
                             correct: true,
                             position: 0)
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

    it { is_expected.to include(id: "#{question_option.id}") }
    it { is_expected.to include(type: :question_option) }

    describe '> attributes' do
      subject { data[:attributes] }

      it { is_expected.to include(text: '42') }

      context 'given policy with show correct flag set to true' do
        before(:each) do
          allow_any_instance_of(QuestionOptionPolicy)
          .to receive(:show_correct_flag?)
          .and_return(true)
        end

        it { is_expected.to include(correct: true) }
      end

      context 'given policy with show correct flag set to false' do
        before(:each) do
          allow_any_instance_of(QuestionOptionPolicy)
          .to receive(:show_correct_flag?)
          .and_return(false)
        end

        it { is_expected.not_to include(:correct) }
      end

      it { is_expected.to include(position: 0) }
    end

    describe '> relationships' do
      describe '> question' do
        subject { data[:relationships][:question][:data] }

        it { is_expected.to include_identifier_of(question) }
      end
    end
  end
end
