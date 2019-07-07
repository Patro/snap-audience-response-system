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

  describe 'PATCH /api/users/:id' do
    let!(:record) { create(:user) }
    let(:updated_record) { User.find(record.id) }
    let(:query_params) { '' }

    def fire_patch
      params = { data: data }
      patch "/api/users/#{id}", params: params
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'update resource', model_class: User,
                                          expect_changes: false
    end

    context 'given data object with name' do
      let!(:record) { create(:user, name: 'John Doe') }
      let(:data) { { attributes: { name: 'Jane Doe' } } }
      let(:expected_record_attributes) { { name: 'Jane Doe' } }

      include_examples 'update resource', model_class: User
    end
  end
end
