# frozen_string_literal: true

FactoryBot.define do
  factory :poll do
    association :question, factory: :dummy_question
    closed { false }
  end
end
