# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Interactive Sessions API', type: :request do
  include RequestHelpers

  describe 'GET /interactive_sessions' do
    let!(:records) { create_list(:interactive_session, 2) }

    def fire_get
      get '/interactive_sessions'
    end

    include_examples 'get collection of resources',
                      model_class: InteractiveSession
  end

  describe 'POST /interactive_sessions' do
    let(:created_record) { InteractiveSession.last }

    def fire_post
      post '/interactive_sessions', params: { data: data }
    end

    context 'given empty data object' do
      let(:data) { {} }
      let(:expected_record_attributes) { { label: nil } }

      include_examples 'create resource', model_class: InteractiveSession
    end

    context 'given label' do
      let(:data) { { attributes: { label: 'My Session' } } }
      let(:expected_record_attributes) { { label: 'My Session' } }

      include_examples 'create resource', model_class: InteractiveSession
    end
  end

  describe 'GET /interactive_sessions/:id' do
    let!(:record) { create(:interactive_session) }

    def fire_get
      get "/interactive_sessions/#{id}"
    end

    include_examples 'get resource', model_class: InteractiveSession
  end

  describe 'PATCH /interactive_sessions/:id' do
    let!(:record) { create(:interactive_session, label: 'My Session') }

    def fire_patch
      params = { data: data }
      patch "/interactive_sessions/#{id}", params: params
    end

    context 'given empty data object' do
      let(:data) { {} }
      let(:expected_record_attributes) { { label: 'My Session' } }

      include_examples 'update resource', model_class: InteractiveSession
    end

    context 'given label' do
      let(:data) { { attributes: { label: 'My Great Session' } } }
      let(:expected_record_attributes) { { label: 'My Great Session' } }

      include_examples 'update resource', model_class: InteractiveSession
    end

    context 'given attendance code' do
      let(:record) { create(:interactive_session, attendance_code: 'ABCD') }
      let(:data) { { attributes: { attendance_code: 'AAAA' } } }
      let(:expected_record_attributes) { { attendance_code: 'ABCD' } }

      include_examples 'update resource', model_class: InteractiveSession
    end
  end

  describe 'DELETE /interactive_sessions/:id' do
    let!(:record) { create(:interactive_session) }

    def fire_delete
      delete "/interactive_sessions/#{id}"
    end

    include_examples 'delete resource', model_class: InteractiveSession
  end
end
