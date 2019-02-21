# frozen_string_literal: true

FactoryBot.define do
  factory :attendance do
    attendee
    interactive_session
  end
end
