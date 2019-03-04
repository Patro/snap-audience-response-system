# frozen_string_literal: true

module Errors
  class UnprocessableEntityError < ApplicationError
    def initialize(error_message:)
      super
      @error_message = error_message
    end

    def title
      'Resource can not be processed'
    end

    def detail
      @error_message
    end

    def status
      :unprocessable_entity
    end
  end
end
