# frozen_string_literal: true

class UsersController < ApplicationController
  include Listable # index action
  include Viewable # show action

  private

    def record_class
      User
    end
end
