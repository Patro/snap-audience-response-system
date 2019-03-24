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

    it { is_expected.to include(id: "#{poll.id}") }
    it { is_expected.to include(type: :poll) }

    describe '> attributes' do
      subject { data[:attributes] }

      it { is_expected.to include(status: :open) }
      it { is_expected.to include(responded: false) }
    end

    describe '> relationships' do
      describe '> question' do
        subject { data[:relationships][:question][:data] }

        it { is_expected.to include_identifier_of(question) }
      end
    end
  end
end
