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
        respondent { nil }
        responses_count { 2 }
      end

      after(:create) do |poll, evaluator|
        evaluator.responses_count.times.each do |index|
          option = create(:question_option, question: poll.question,
                                            position: index)
          respondent = evaluator.respondent || create(:respondent)
          create(:response, picked_question_option: option,
                            poll: poll,
                            respondent: respondent)
        end
      end
    end
  end
end
