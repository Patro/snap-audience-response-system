# frozen_string_literal: true

FactoryBot.define do
  factory :poll do
    association :question, factory: :dummy_question
    open

    trait :open do
      closed { false }
    end
    trait :closed do
      closed { true }
    end
  end
end
