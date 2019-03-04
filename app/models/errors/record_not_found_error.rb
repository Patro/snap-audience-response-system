# frozen_string_literal: true

module Errors
  class RecordNotFoundError < ApplicationError
    def title
      'Resource does not exist'
    end

    def detail
      'The requested resouce was not found.'
    end

    def status
      :not_found
    end
  end
end
