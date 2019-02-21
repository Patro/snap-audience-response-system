# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Question, type: :model do
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
