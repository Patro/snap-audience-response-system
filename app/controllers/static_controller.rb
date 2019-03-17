# frozen_string_literal: true

class StaticController < ActionController::Base
  def index
    render file: 'frontend/build/index.html'
  end
end
