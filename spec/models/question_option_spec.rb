# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionOption, type: :model do
  describe '#valid?' do
    subject { option.valid? }

    context 'given option with question' do
      let(:option) { build(:question_option, question: create(:dummy_question)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given option without question' do
      let(:option) { build(:question_option, question: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given option with text' do
      let(:option) { build(:question_option, text: '42') }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given option with empty text' do
      let(:option) { build(:question_option, text: '') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given option without text' do
      let(:option) { build(:question_option, text: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given option with correct flag set to true' do
      let(:option) { build(:question_option, correct: true) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given option with correct flag set to false' do
      let(:option) { build(:question_option, correct: false) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given option without correct flag set' do
      let(:option) { build(:question_option, correct: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
