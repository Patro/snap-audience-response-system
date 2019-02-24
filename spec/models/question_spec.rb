# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Question, type: :model do
  describe '#destroy' do
    subject { -> { question.destroy } }

    context 'given question with two options' do
      let(:question) { create(:dummy_question) }

      before(:each) { create_list(:question_option, 2, question: question) }

      it 'should destroy options' do
        is_expected.to change { QuestionOption.count }.from(2).to(0)
      end
    end

    context 'given question with two polls' do
      let(:question) { create(:dummy_question) }

      before(:each) { create_list(:poll, 2, question: question) }

      it 'should destroy polls' do
        is_expected.to change { Poll.count }.from(2).to(0)
      end
    end
  end

  describe '#options' do
    subject { question.options }

    context 'given question with two options' do
      let(:question) { create(:dummy_question) }

      before(:each) do
        @options = create_list(:question_option, 2, question: question)
      end

      it 'should return options' do
        is_expected.to match(@options)
      end
    end
  end

  describe '#polls' do
    subject { question.polls }

    context 'given question with two polls' do
      let(:question) { create(:dummy_question) }

      before(:each) do
        @polls = create_list(:poll, 2, question: question)
      end

      it 'should return polls' do
        is_expected.to match(@polls)
      end
    end
  end

  describe '#valid?' do
    subject { question.valid? }

    context 'given question without type' do
      let(:question) { build(:dummy_question, type: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given question with non existing type' do
      let(:question) { build(:dummy_question, type: :non_existing_type) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given question with text' do
      let(:question) { build(:dummy_question, text: 'What is the answer of everything?') }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given question without text' do
      let(:question) { build(:dummy_question, text: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given question with empty text' do
      let(:question) { build(:dummy_question, text: '') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given question with interactive session' do
      let(:question) do
        build(:dummy_question,
              interactive_session: create(:interactive_session))
      end

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given question without interactive session' do
      let(:question) { build(:dummy_question, interactive_session: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
