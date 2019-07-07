# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Attendances API', type: :request do
  include RequestHelpers

  describe 'GET /api/attendances' do
    def fire_get
      get '/api/attendances'
    end

    context 'without attendances' do
      include_examples 'get empty collection of resources',
                        model_class: Attendance
    end

    context 'given two attendances' do
      let!(:records) { create_list(:attendance, 2) }

      include_examples 'get collection of resources',
                        model_class: Attendance
    end
  end

  describe 'GET /api/attendances?interactive_session_id=' do
    let(:interactive_session) { create(:interactive_session) }
    let!(:records) do
      create_list(:attendance, 2, interactive_session: interactive_session)
    end
    let!(:non_matching_records) { create_list(:attendance, 2) }

    def fire_get
      get "/api/attendances?interactive_session_id=#{interactive_session.id}"
    end

    include_examples 'get collection of resources',
                      model_class: Attendance, with_filter: true
  end

  describe 'GET /api/interactive_sessions/:id/attendances' do
    let(:interactive_session) { create(:interactive_session) }
    let!(:records) do
      create_list(:attendance, 2, interactive_session: interactive_session)
    end
    let!(:non_matching_records) { create_list(:attendance, 2) }

    def fire_get
      get "/api/interactive_sessions/#{interactive_session.id}/attendances"
    end

    include_examples 'get collection of resources',
                      model_class: Attendance, with_filter: true
  end

  describe 'POST /api/attendances' do
    let!(:interactive_session) { create(:interactive_session, attendance_code: 'ABCD') }
    let(:created_record) { Attendance.last }

    def fire_post
      post '/api/attendances', params: { data: data }
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'fail to create resource',
                       model_class: Poll,
                       status: :unprocessable_entity
    end

    context 'given valid attendance code' do
      let(:data) { { attributes: { attendance_code: 'ABCD' } } }
      let(:expected_record_attributes) do
        { interactive_session: interactive_session }
      end

      include_examples 'create resource', model_class: Attendance
    end

    context 'given non existing attendance code' do
      let(:data) { { attributes: { attendance_code: 'AAAA' } } }
      let(:expected_record_attributes) do
        { interactive_session: interactive_session }
      end

      include_examples 'fail to create resource',
                       model_class: Attendance, status: :unprocessable_entity
    end
  end

  describe 'GET /api/attendances/:id' do
    let!(:record) { create(:attendance) }

    def fire_get
      get "/api/attendances/#{id}"
    end

    include_examples 'get resource', model_class: Attendance
  end

  describe 'PATCH /api/attendances/:id' do
    let!(:record) { create(:attendance) }

    def fire_patch
      patch "/api/attendances/#{record.id}"
    end

    it 'should raise routing error' do
      expect { fire_patch }.to raise_error(ActionController::RoutingError)
    end
  end

  describe 'DELETE /api/attendances/:id' do
    let!(:record) { create(:attendance) }

    def fire_delete
      delete "/api/attendances/#{id}"
    end

    include_examples 'delete resource', model_class: Attendance
  end
end
