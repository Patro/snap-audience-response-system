# frozen_string_literal: true

FactoryBot.define do
  factory :user, aliases: [:attendee, :owner, :requester, :respondent] do
    trait :with_attendance do
      transient do
        interactive_session { create(:interactive_session) }
      end

      after(:create) do |user, evaluator|
        Attendance.create(
          attendee: user,
          interactive_session: evaluator.interactive_session
        )
      end
    end
  end
end
