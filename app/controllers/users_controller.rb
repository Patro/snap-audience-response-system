# frozen_string_literal: true

class UsersController < ApplicationController
  include Listable # index action
  include Updatable # update action
  include Viewable # show action

  private

    def params_for_update
      {
        name: params.dig(:data, :attributes, :name),
      }.compact
    end

    def record_class
      User
    end
end
