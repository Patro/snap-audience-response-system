# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ResponseSerializer do
  let(:question) { create(:single_choice_question) }
  let(:question_option) { create(:question_option, question: question)}
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

    it 'should serialize id' do
      id_parts = [poll.id, response.respondent.id, question_option.id]
      is_expected.to include(id: id_parts.join(','))
    end

    it 'should serialize type' do
      is_expected.to include(type: :response)
    end

    it 'should not serialize attributes' do
      is_expected.not_to include(:attributes)
    end

    describe 'relationships' do
      describe 'poll' do
        subject { data[:relationships][:poll][:data] }

        it 'should serialize id' do
          is_expected.to include(id: poll.id.to_s)
        end

        it 'should serialize type' do
          is_expected.to include(type: :poll)
        end
      end

      describe 'question_option' do
        subject { data[:relationships][:picked_question_option][:data] }

        it 'should serialize id' do
          is_expected.to include(id: question_option.id.to_s)
        end

        it 'should serialize type' do
          is_expected.to include(type: :question_option)
        end
      end
    end
  end
end
