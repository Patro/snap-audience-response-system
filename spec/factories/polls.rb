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

    trait :with_responses do
      transient do
        respondent { create(:respondent) }
        responses_count { 2 }
      end

      after(:create) do |poll, evaluator|
        evaluator.responses_count.times.each do
          option = create(:question_option, question: poll.question)
          create(:response, picked_question_option: option,
                            poll: poll,
                            respondent: evaluator.respondent)
        end
      end
    end
  end
end
