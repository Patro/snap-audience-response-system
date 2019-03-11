# frozen_string_literal: true

module Relatable
  class ToOneRelationshipEvaluator
    def initialize(type, params)
      @type = type.to_sym
      @params = params
    end

    def id_of_related_resource
      check_ambiguity!
      unique_id_candidates.first
    end

    private
      attr_accessor :type, :params

      def unique_id_candidates
        [from_query_params, from_relationships].compact.uniq
      end

      def from_query_params
        params["#{type}_id"]
      end

      def from_relationships
        params.dig(:data, :relationships, type, :data, :id)
      end

      def check_ambiguity!
        return if unique_id_candidates.count < 2

        raise Errors::UnprocessableEntityError,
              error_message: "Given #{type} is ambiguous."
      end
  end

  private

    def id_of_related_resource(type)
      ToOneRelationshipEvaluator.new(type, params).id_of_related_resource
    end
end
