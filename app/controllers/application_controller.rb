# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Pundit

  before_action :initialize_session

  private

    def current_user
      @current_user = User.find(session[:user_id])
    end

    def initialize_session
      return if session[:user_id].present?

      session[:user_id] = User.create.id
    end
end
