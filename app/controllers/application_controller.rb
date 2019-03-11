# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Pundit

  before_action :initialize_session
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

  private

    def current_user
      @current_user = User.find(session[:user_id])
    end

    def initialize_session
      return if session[:user_id].present?

      session[:user_id] = User.create.id
    end

    def user_not_authorized
      error = Errors::NotAuthorizedError.new
      render json: ErrorSerializer.new(error), status: :forbidden
    end

    def record_not_found
      error = Errors::RecordNotFoundError.new
      render json: ErrorSerializer.new(error), status: :not_found
    end

    def record_invalid(record_invalid_error)
      error_messages = record_invalid_error.record.errors.full_messages
      errors = error_messages.map do |message|
        Errors::UnprocessableEntityError.new(error_message: message + '.')
      end
      render json: ErrorSerializer.new(errors), status: :unprocessable_entity
    end
end
