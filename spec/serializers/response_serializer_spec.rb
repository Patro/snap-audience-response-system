# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ResponseSerializer do
  let(:question) { create(:single_choice_question) }
  let(:question_option) { create(:question_option, question: question) }
  let(:poll) { create(:poll, question: question) }
  let(:response) do
    create(:response, poll: poll, picked_question_option: question_option)
  end
  let(:serializer) do
    ResponseSerializer.new(response, params: { current_user: create(:user) })
  end
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it { is_expected.to include(id: response.id.join(',')) }
    it { is_expected.to include(type: :response) }
    it { is_expected.not_to include(:attributes) }

    describe '> relationships' do
      describe '> poll' do
        subject { data[:relationships][:poll][:data] }

        it { is_expected.to include_identifier_of(poll) }
      end

      describe '> question_option' do
        subject { data[:relationships][:picked_question_option][:data] }

        it { is_expected.to include_identifier_of(question_option) }
      end
    end
  end
end
