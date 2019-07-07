# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Interactive Sessions API', type: :request do
  include RequestHelpers

  describe 'GET /api/interactive_sessions' do
    def fire_get
      get '/api/interactive_sessions'
    end

    context 'without sessions' do
      include_examples 'get empty collection of resources',
                        model_class: InteractiveSession
    end

    context 'given two sessions' do
      let!(:records) { create_list(:interactive_session, 2) }

      include_examples 'get collection of resources',
                        model_class: InteractiveSession
    end
  end

  describe 'POST /api/interactive_sessions' do
    let(:created_record) { InteractiveSession.last }

    def fire_post
      post '/api/interactive_sessions', params: { data: data }
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

  describe 'GET /api/interactive_sessions/:id' do
    let!(:record) { create(:interactive_session) }

    def fire_get
      get "/api/interactive_sessions/#{id}"
    end

    include_examples 'get resource', model_class: InteractiveSession
  end

  describe 'PATCH /api/interactive_sessions/:id' do
    let!(:record) { create(:interactive_session, label: 'My Session') }
    let(:updated_record) { InteractiveSession.find(record.id) }

    def fire_patch
      params = { data: data }
      patch "/api/interactive_sessions/#{id}", params: params
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

  describe 'DELETE /api/interactive_sessions/:id' do
    let!(:record) { create(:interactive_session) }

    def fire_delete
      delete "/api/interactive_sessions/#{id}"
    end

    include_examples 'delete resource', model_class: InteractiveSession
  end
end
