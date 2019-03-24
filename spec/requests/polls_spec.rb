# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Polls API', type: :request do
  include RequestHelpers

  describe 'GET /api/polls' do
    let!(:records) { create_list(:poll, 2) }

    def fire_get
      get '/api/polls'
    end

    include_examples 'get collection of resources',
                      model_class: Poll
  end

  describe 'GET /api/polls?interactive_session_id=' do
    let(:interactive_session) { create(:interactive_session) }
    let(:question) do
      create(:dummy_question, interactive_session: interactive_session)
    end
    let!(:records) { create_list(:poll, 2, question: question) }
    let!(:non_matching_records) { create_list(:poll, 2) }

    def fire_get
      get "/api/polls?interactive_session_id=#{interactive_session.id}"
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'GET /api/interactive_sessions/:id/polls' do
    let(:interactive_session) { create(:interactive_session) }
    let(:question) do
      create(:dummy_question, interactive_session: interactive_session)
    end
    let!(:records) { create_list(:poll, 2, question: question) }
    let!(:non_matching_records) { create_list(:poll, 2) }

    def fire_get
      get "/api/interactive_sessions/#{interactive_session.id}/polls"
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'GET /api/polls?question_id=' do
    let(:question) { create(:dummy_question) }
    let!(:records) { create_list(:poll, 2, question: question) }
    let!(:non_matching_records) { create_list(:poll, 2) }

    def fire_get
      get "/api/polls?question_id=#{question.id}"
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'GET /api/questions/:id/polls' do
    let(:question) { create(:dummy_question) }
    let!(:records) { create_list(:poll, 2, question: question) }
    let!(:non_matching_records) { create_list(:poll, 2) }

    def fire_get
      get "/api/questions/#{question.id}/polls"
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'GET /api/polls?status=open' do
    let!(:records) { create_list(:poll, 2, closed: false) }
    let!(:non_matching_records) { create_list(:poll, 2, closed: true) }

    def fire_get
      get '/api/polls?status=open'
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'GET /api/polls?status=closed' do
    let!(:records) { create_list(:poll, 2, closed: true) }
    let!(:non_matching_records) { create_list(:poll, 2, closed: false) }

    def fire_get
      get '/api/polls?status=closed'
    end

    include_examples 'get collection of resources',
                      model_class: Poll, with_filter: true
  end

  describe 'POST /api/polls' do
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
      post "/api/polls?#{query_params}", params: { data: data }
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'fail to create resource',
                       model_class: Poll,
                       status: :unprocessable_entity
    end

    context 'given data object with status closed' do
      let(:data) { poll_data.deep_merge(attributes: { status: 'closed' }) }
      let(:expected_record_attributes) { { closed: true } }

      include_examples 'create resource', model_class: Poll

      context 'given policy that permits access' do
        permit_action(Poll, :create?)

        it 'should broadcast poll created event' do
          expect { fire_post }
          .to have_broadcasted_to(question.interactive_session)
          .from_channel(ApplicationCable::InteractiveSessionChannel)
          .with(an_object_satisfying { |message|
            message.deep_symbolize_keys
            .eql?(event: {
              type: 'POLL_CREATED',
              poll_id: json['data']['id']
            })
          })
        end
      end
    end

    context 'given data object with status open' do
      let(:data) { poll_data.deep_merge(attributes: { status: 'open' }) }
      let(:expected_record_attributes) { { closed: false } }

      include_examples 'create resource', model_class: Poll
    end

    context 'given data object with missing status' do
      let(:data) { poll_data.deep_merge(attributes: { status: nil }) }
      let(:expected_record_attributes) { { closed: false } }

      include_examples 'create resource', model_class: Poll
    end

    context 'given data object with undefined status' do
      let(:data) { poll_data.deep_merge(attributes: { status: 'undefined_status' }) }

      include_examples 'fail to create resource',
                       model_class: Poll,
                       status: :unprocessable_entity
    end

    describe 'given relationship to question' do
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

  describe 'POST /api/questions/:id/polls' do
    let(:question) { create(:dummy_question) }
    let(:data) { { type: 'Poll' } }
    let(:created_record) { Poll.last }
    let(:expected_record_attributes) { { question: question } }

    def fire_post
      post "/api/questions/#{question.id}/polls",
           params: { data: data }
    end

    include_examples 'create resource', model_class: Poll
  end

  describe 'GET /api/polls/:id' do
    let!(:record) { create(:poll) }

    def fire_get
      get "/api/polls/#{id}"
    end

    include_examples 'get resource', model_class: Poll
  end

  describe 'PATCH /api/polls/:id' do
    let!(:record) { create(:poll) }
    let(:updated_record) { Poll.find(record.id) }
    let(:query_params) { '' }

    def fire_patch
      params = { data: data }
      patch "/api/polls/#{id}?#{query_params}", params: params
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'update resource', model_class: Poll,
                                          expect_changes: false
    end

    context 'given data object with status closed' do
      let!(:record) { create(:poll, closed: false) }
      let(:data) { { attributes: { status: 'closed' } } }
      let(:expected_record_attributes) { { closed: true } }

      include_examples 'update resource', model_class: Poll

      context 'given policy that permits access' do
        permit_action(Poll, :update?)

        let(:id) { record.id }

        it 'should broadcast poll updated event' do
          expect { fire_patch }
          .to have_broadcasted_to(record.interactive_session)
          .from_channel(ApplicationCable::InteractiveSessionChannel)
          .with(event: { type: 'POLL_UPDATED', poll_id: id.to_s })
        end
      end
    end

    context 'given data object with status open' do
      let!(:record) { create(:poll, closed: true) }
      let(:data) { { attributes: { status: 'open' } } }
      let(:expected_record_attributes) { { closed: false } }

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

  describe 'DELETE /api/polls/:id' do
    let!(:record) { create(:poll) }

    def fire_delete
      delete "/api/polls/#{id}"
    end

    include_examples 'delete resource', model_class: Poll

    context 'given policy that permits access' do
      permit_action(Poll, :destroy?)

      let(:id) { record.id }

      it 'should broadcast poll detroyed event' do
        expect { fire_delete }
        .to have_broadcasted_to(record.interactive_session)
        .from_channel(ApplicationCable::InteractiveSessionChannel)
        .with(event: { type: 'POLL_DESTROYED', poll_id: id.to_s })
      end
    end
  end
end
