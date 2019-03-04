# frozen_string_literal: true

module Errors
  class CustomError < ApplicationError
    attr_accessor :title, :detail, :status

    def initialize(title: nil, detail: nil, status: nil)
      super
      @title = title
      @detail = detail
      @status = status
    end
  end
end
