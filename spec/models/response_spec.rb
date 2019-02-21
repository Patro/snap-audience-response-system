# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Response, type: :model do
  # behaviour of #eql? differs from default active record implementation
  # because of composite primary key
  describe '#eql?' do
    context 'given a response and a clone of it' do
      let(:response) { create(:response) }
      let(:clone) { response.clone }

      it 'should recognize clone as eql' do
        expect(response).to eql(clone)
      end
    end
  end

  describe '#valid?' do
    subject { response.valid? }

    context 'given response with picked question option' do
      let(:response) { build(:response, picked_question_option: create(:question_option)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given response without picked question option' do
      let(:response) { build(:response, picked_question_option: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given response with poll' do
      let(:response) { build(:response, poll: create(:poll)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given response without poll' do
      let(:response) { build(:response, poll: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given response with respondent' do
      let(:response) { build(:response, respondent: create(:respondent)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given response without respondent' do
      let(:response) { build(:response, respondent: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
