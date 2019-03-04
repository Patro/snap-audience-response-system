# frozen_string_literal: true

FactoryBot.define do
  factory :custom_error, class: Errors::CustomError do
    title { 'Server Error' }
    detail { 'A server error occured.' }
    status { '500' }
  end
end
