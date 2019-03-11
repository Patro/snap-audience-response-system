# frozen_string_literal: true

FactoryBot.define do
  factory :attendance_request do
    attendance_code { 'ABCD' }
    requester
  end
end
