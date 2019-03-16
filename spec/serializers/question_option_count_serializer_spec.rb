# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionOptionCountSerializer do
  let(:question_option_count) do
    build(:question_option_count, number_of_responses: 10)
  end
  let(:serializer) do
    QuestionOptionCountSerializer.new(
      question_option_count,
      params: { current_user: create(:user) }
    )
  end
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it { is_expected.to include(id: question_option_count.id) }
    it { is_expected.to include(type: :question_option_count) }

    describe '> attributes' do
      subject { data[:attributes] }

      it { is_expected.to include(number_of_responses: 10) }
    end

    describe '> relationships' do
      describe '> poll' do
        let(:poll) { question_option_count.poll }

        subject { data[:relationships][:poll][:data] }

        it { is_expected.to include_identifier_of(poll) }
      end

      describe '> question option' do
        let(:question_option) { question_option_count.question_option }

        subject { data[:relationships][:question_option][:data] }

        it { is_expected.to include_identifier_of(question_option) }
      end
    end
  end
end
