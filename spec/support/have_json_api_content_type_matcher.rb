# frozen_string_literal: true

RSpec::Matchers.define :have_json_api_content_type do |expected|
  match do |actual|
    values_match?(json_api_content_type, actual.content_type)
  end

  failure_message do
    "expected that #{actual.content_type} would match #{json_api_content_type}"
  end

  failure_message_when_negated do
    "expected that #{actual.content_type} would not match #{json_api_content_type}"
  end

  private

    def json_api_content_type
      'application/vnd.api+json'
    end
end
