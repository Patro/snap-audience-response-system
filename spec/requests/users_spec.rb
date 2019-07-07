# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Users API', type: :request do
  include RequestHelpers

  describe 'GET /api/users' do
    def fire_get
      get '/api/users'
    end

    context 'given current user' do
      set_current_user
      let(:records) { [current_user] }

      include_examples 'get collection of resources',
                        model_class: User
    end
  end

  describe 'GET /api/users/:id' do
    let!(:record) { create(:user) }

    def fire_get
      get "/api/users/#{id}"
    end

    include_examples 'get resource', model_class: User
  end
end
