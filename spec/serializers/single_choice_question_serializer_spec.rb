# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SingleChoiceQuestionSerializer do
  let(:interactive_session) { create(:interactive_session) }
  let(:question) do
    create(
      :single_choice_question,
      interactive_session: interactive_session,
      text: 'What is the answer of everything?'
    )
  end
  let(:serializer) do
    SingleChoiceQuestionSerializer.new(
      question,
      params: { current_user: create(:user) }
    )
  end
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it { is_expected.to include(type: :single_choice_question) }
  end
end
