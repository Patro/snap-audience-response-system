# frozen_string_literal: true

FactoryBot.define do
  factory :interactive_session do
    label { 'My Great Interactive Session' }
    sequence(:attendance_code) { |n| n.to_s.rjust(4, '0') }
    owner
  end
end
