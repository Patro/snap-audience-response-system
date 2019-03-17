# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Responses API', type: :request do
  include RequestHelpers

  describe 'GET /api/responses' do
    let!(:records) { create_list(:response, 2) }

    def fire_get
      get '/api/responses'
    end

    include_examples 'get collection of resources',
                      model_class: Response
  end

  describe 'GET /api/responses?poll_id=' do
    let(:poll) { create(:poll) }
    let!(:records) { create_list(:response, 2, poll: poll) }
    let!(:non_matching_records) { create_list(:response, 2) }

    def fire_get
      get "/api/responses?poll_id=#{poll.id}"
    end

    include_examples 'get collection of resources',
                      model_class: Response, with_filter: true
  end

  describe 'GET /api/polls/:id/responses' do
    let(:poll) { create(:poll) }
    let!(:records) { create_list(:response, 2, poll: poll) }
    let!(:non_matching_records) { create_list(:response, 2) }

    def fire_get
      get "/api/polls/#{poll.id}/responses"
    end

    include_examples 'get collection of resources',
                      model_class: Response, with_filter: true
  end

  describe 'POST /api/responses' do
    let(:question) { create(:dummy_question) }
    let(:question_option) { create(:question_option, question: question) }
    let(:poll) { create(:poll, question: question) }
    let(:response_data) do
      {
        type: 'Response',
        relationships: {
          poll: {
            data: { id: poll.id, type: :poll }
          },
          picked_question_option: {
            data: { id: question_option.id, type: :question_option }
          }
        }
      }
    end
    let(:created_record) { Response.last }
    let(:query_params) { '' }

    def fire_post
      post "/api/responses?#{query_params}", params: { data: data }
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'fail to create resource',
                       model_class: Response, status: :unprocessable_entity
    end

    describe 'given relationship to poll' do
      let(:data_with_relationship) { response_data }
      let(:data_without_relationship) do
        response_data.deep_merge(relationships: { poll: nil })
      end
      let(:related_record) { poll }
      let(:other_record) { create(:poll) }
      let(:query_key) { 'poll_id' }
      let(:expected_record_attributes) { { poll: poll } }

      include_examples 'create resource with relationship',
                       model_class: Response
    end

    describe 'given relationship to picked question option' do
      let(:data_with_relationship) { response_data }
      let(:data_without_relationship) do
        response_data.deep_merge(
          relationships: { picked_question_option: nil }
        )
      end
      let(:related_record) { question_option }
      let(:other_record) { create(:question_option) }
      let(:query_key) { 'picked_question_option_id' }
      let(:expected_record_attributes) do
        { picked_question_option: question_option }
      end

      include_examples 'create resource with relationship',
                       model_class: Response
    end
  end

  describe 'POST /api/polls/:id/responses' do
    let(:question) { create(:dummy_question) }
    let(:question_option) { create(:question_option, question: question) }
    let(:poll) { create(:poll, question: question) }
    let(:data) do
      {
        type: 'Response',
        relationships: {
          picked_question_option: {
            data: { id: question_option.id, type: :question_option }
          }
        }
      }
    end
    let(:created_record) { Response.last }
    let(:expected_record_attributes) do
      { poll: poll }
    end

    def fire_post
      post "/api/polls/#{poll.id}/responses", params: { data: data }
    end

    include_examples 'create resource', model_class: Response
  end

  describe 'GET /api/responses/:id' do
    let!(:record) { create(:response) }

    def fire_get
      get "/api/responses/#{id}"
    end

    include_examples 'get resource', model_class: Response
  end

  describe 'PATCH /api/responses/:id' do
    let!(:record) { create(:response) }

    def fire_patch
      params = { data: {} }
      patch "/api/responses/#{record.id}", params: params
    end

    it 'should raise routing error' do
      expect { fire_patch }.to raise_error(ActionController::RoutingError)
    end
  end

  describe 'DELETE /api/responses/:id' do
    let!(:record) { create(:response) }

    def fire_delete
      delete "/api/responses/#{record.id}"
    end

    it 'should raise routing error' do
      expect { fire_delete }.to raise_error(ActionController::RoutingError)
    end
  end
end
