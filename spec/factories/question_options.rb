# frozen_string_literal: true

FactoryBot.define do
  factory :question_option do
    association :question, factory: :dummy_question
    text { '42' }
    correct { true }
  end
end
