# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PollSerializer do
  let(:question) { create(:single_choice_question) }
  let(:poll) { create(:poll, :open, question: question) }
  let(:serializer) do
    PollSerializer.new(poll, params: { current_user: create(:user) })
  end
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it 'should serialize id' do
      is_expected.to include(id: "#{poll.id}")
    end

    it 'should serialize type' do
      is_expected.to include(type: :poll)
    end

    describe 'attributes' do
      subject { data[:attributes] }

      it 'should serialize closed' do
        is_expected.to include(closed: false)
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
