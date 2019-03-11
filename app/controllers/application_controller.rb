# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Pundit

  before_action :initialize_session
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActiveModel::ValidationError, with: :validation_error
  rescue_from Errors::ApplicationError, with: :application_error

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
      errors = record_invalid_error.record.errors
      render_unprocessable_entity_errors_for(errors)
    end

    def validation_error(validation_error)
      errors = validation_error.model.errors
      render_unprocessable_entity_errors_for(errors)
    end

    def render_unprocessable_entity_errors_for(model_errors)
      error_messages = model_errors.full_messages
      errors = error_messages.map do |message|
        Errors::UnprocessableEntityError.new(error_message: message + '.')
      end
      render json: ErrorSerializer.new(errors), status: :unprocessable_entity
    end

    def application_error(application_error)
      render json: ErrorSerializer.new(application_error),
             status: application_error.status
    end

    def serializer_class
      raise NotImplementedError
    end

    def render_collection(records:, **options)
      serializer = serializer_class.new(
        records,
        params: { current_user: current_user },
        meta: { total: records.count }
      )
      render json: serializer, **options.except(:records)
    end

    def render_record(record:, **options)
      serializer = serializer_class.new(
        record,
        params: { current_user: current_user }
      )
      render json: serializer, **options.except(:record)
    end
end
