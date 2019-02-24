# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Poll, type: :model do
  describe '#valid?' do
    subject { poll.valid? }

    context 'given poll with question' do
      let(:poll) { build(:poll, question: create(:dummy_question)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given poll without question' do
      let(:poll) { build(:poll, question: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given poll with closed set to false' do
      let(:poll) { build(:poll, closed: false) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given poll with closed set to true' do
      let(:poll) { build(:poll, closed: true) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given poll with closed set to nil' do
      let(:poll) { build(:poll, closed: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
