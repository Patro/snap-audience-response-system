# frozen_string_literal: true

FactoryBot.define do
  factory :question_option_count do
    poll { create(:poll) }
    question_option { create(:question_option) }
    number_of_responses { 10 }
  end
end
