# frozen_string_literal: true

RSpec::Matchers.define :include_identifier_of do |expected|
  match do
    intersection = actual_identifiers & expected_identifiers
    intersection.count == expected_identifiers.count
  end

  description do
    "include resource with identifier #{expected_identifiers}"
  end

  failure_message do
    "expected that #{actual_identifiers} would include #{expected_identifiers}"
  end

  failure_message_when_negated do
    "expected that #{actual_identifiers} would not include #{expected_identifiers}"
  end

  private

    def map_resources_to_identifiers(resources)
      resources.map do |resource|
        resource = resource.with_indifferent_access
        { id: resource[:id].to_s, type: resource[:type].to_s }
      end
    end

    def map_models_to_identifiers(models)
      models.map do |model|
        { id: model.id.to_s, type: model.class.to_s.underscore }
      end
    end

    def actual_identifiers
      @actual_identifiers ||= map_resources_to_identifiers(to_array(actual))
    end

    def expected_identifiers
      @expected_identifiers ||= map_models_to_identifiers(to_array(expected))
    end

    def to_array(obj)
      obj.is_a?(Array) || obj.is_a?(ActiveRecord::Relation) ? obj : [obj]
    end
end
