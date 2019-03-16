# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Polls API', type: :request do
  include RequestHelpers

  describe 'GET /polls' do
    let!(:records) { create_list(:poll, 2) }

    def fire_get
      get '/polls'
    end

    include_examples 'get collection of resources',
                      model_class: Poll
  end

  describe 'GET /polls?question_id=' do
    let(:question) { create(:dummy_question) }
    let!(:records) { create_list(:poll, 2, question: question) }
    let!(:non_matching_records) { create_list(:poll, 2) }

    def fire_get
      get "/polls?question_id=#{question.id}"
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'GET /questions/:id/polls' do
    let(:question) { create(:dummy_question) }
    let!(:records) { create_list(:poll, 2, question: question) }
    let!(:non_matching_records) { create_list(:poll, 2) }

    def fire_get
      get "/questions/#{question.id}/polls"
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'GET /polls?status=open' do
    let!(:records) { create_list(:poll, 2, closed: false) }
    let!(:non_matching_records) { create_list(:poll, 2, closed: true) }

    def fire_get
      get '/polls?status=open'
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'GET /polls?status=closed' do
    let!(:records) { create_list(:poll, 2, closed: true) }
    let!(:non_matching_records) { create_list(:poll, 2, closed: false) }

    def fire_get
      get '/polls?status=closed'
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'POST /polls' do
    let(:question) { create(:dummy_question) }
    let(:poll_data) do
      {
        type: 'Poll',
        attributes: {
          closed: 'false',
        },
        relationships: {
          question: {
            data: { id: question.id, type: :dummy_question },
          },
        },
      }
    end
    let(:created_record) { Poll.last }
    let(:query_params) { '' }

    def fire_post
      post "/polls?#{query_params}", params: { data: data }
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'fail to create resource',
                       model_class: Poll,
                       status: :unprocessable_entity
    end

    context 'given data object with closed flag' do
      let(:data) { poll_data.deep_merge(attributes: { closed: 'true' }) }
      let(:expected_record_attributes) { { closed: true } }

      include_examples 'create resource', model_class: Poll
    end

    context 'given data object with missing closed flag' do
      let(:data) { poll_data.deep_merge(attributes: { closed: nil }) }
      let(:expected_record_attributes) { { closed: false } }

      include_examples 'create resource', model_class: Poll
    end

    describe 'question' do
      let(:data_with_relationship) { poll_data }
      let(:data_without_relationship) do
        poll_data.deep_merge(relationships: { question: nil })
      end
      let(:related_record) { question }
      let(:other_record) { create(:dummy_question) }
      let(:query_key) { 'question_id' }
      let(:expected_record_attributes) { { question: question } }

      include_examples 'create resource with relationship',
                       model_class: Poll
    end
  end

  describe 'POST /questions/:id/polls' do
    let(:question) { create(:dummy_question) }
    let(:data) { { type: 'Poll' } }
    let(:created_record) { Poll.last }
    let(:expected_record_attributes) { { question: question } }

    def fire_post
      post "/questions/#{question.id}/polls",
           params: { data: data }
    end

    include_examples 'create resource', model_class: Poll
  end

  describe 'GET /polls/:id' do
    let!(:record) { create(:poll) }

    def fire_get
      get "/polls/#{id}"
    end

    include_examples 'get resource', model_class: Poll
  end

  describe 'PATCH /polls/:id' do
    let!(:record) { create(:poll) }
    let(:updated_record) { Poll.find(record.id) }
    let(:query_params) { '' }

    def fire_patch
      params = { data: data }
      patch "/polls/#{id}?#{query_params}", params: params
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'update resource', model_class: Poll,
                                          expect_changes: false
    end

    context 'given closed' do
      let!(:record) { create(:poll, closed: false) }
      let(:data) { { attributes: { closed: 'true' } } }
      let(:expected_record_attributes) { { closed: true } }

      include_examples 'update resource', model_class: Poll
    end

    context 'given question' do
      let(:question) { create(:dummy_question) }
      let(:data) { {} }
      let(:query_params) { "question_id=#{question.id}" }

      include_examples 'update resource', model_class: Poll,
                                          expect_changes: false
    end
  end

  describe 'DELETE /polls/:id' do
    let!(:record) { create(:poll) }

    def fire_delete
      delete "/polls/#{id}"
    end

    include_examples 'delete resource', model_class: Poll
  end
end