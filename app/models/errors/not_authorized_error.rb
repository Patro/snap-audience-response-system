# frozen_string_literal: true

module Errors
  class NotAuthorizedError < ApplicationError
    def title
      'Non authorized action'
    end

    def detail
      'The current user is not authorized to perform this action.'
    end

    def status
      :forbidden
    end
  end
end
