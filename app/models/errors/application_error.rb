# frozen_string_literal: true

module Errors
  class ApplicationError < StandardError
    def title; end

    def detail; end

    def status
      :internal_server_error
    end
  end
end
