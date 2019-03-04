# frozen_string_literal: true

module Errors
  class CompoundError < ApplicationError
    attr_reader :errors, :status

    def initialize(errors:, status:)
      super
      @errors = errors
      @status = status
    end
  end
end
