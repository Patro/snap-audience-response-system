# frozen_string_literal: true

FactoryBot.define do
  factory :response do
    association :picked_question_option, factory: :question_option
    poll
    respondent
  end
end
