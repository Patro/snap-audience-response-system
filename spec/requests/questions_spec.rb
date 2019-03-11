# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Questions API', type: :request do
  include RequestHelpers

  describe 'GET /questions' do
    let!(:records) { create_list(:dummy_question, 2) }

    def fire_get
      get '/questions'
    end

    include_examples 'get collection of resources',
                      model_class: Question
  end

  describe 'GET /questions?interactive_session_id=' do
    let(:interactive_session) { create(:interactive_session) }
    let!(:records) do
      create_list(:dummy_question, 2, interactive_session: interactive_session)
    end
    let!(:non_matching_records) { create_list(:dummy_question, 2) }

    def fire_get
      get "/questions?interactive_session_id=#{interactive_session.id}"
    end

    include_examples 'get collection of resources',
                      model_class: Question, with_filter: true
  end

  describe 'GET /interactive_sessions/:id/questions' do
    let(:interactive_session) { create(:interactive_session) }
    let!(:records) do
      create_list(:dummy_question, 2, interactive_session: interactive_session)
    end
    let!(:non_matching_records) { create_list(:dummy_question, 2) }

    def fire_get
      get "/interactive_sessions/#{interactive_session.id}/questions"
    end

    include_examples 'get collection of resources',
                      model_class: Question, with_filter: true
  end

  describe 'POST /questions' do
    let(:interactive_session) { create(:interactive_session) }
    let(:question_data) do
      {
        type: 'SingleChoiceQuestion',
        attributes: {
          text: 'My Question'
        },
        relationships: {
          interactive_session: {
            data: { id: interactive_session.id, type: :interactive_session },
          },
        },
      }
    end
    let(:created_record) { Question.last }
    let(:query_params) { '' }

    def fire_post
      post "/questions?#{query_params}", params: { data: data }
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'fail to create resource',
                       model_class: Question, status: :unprocessable_entity
    end

    context 'given data object with valid type' do
      let(:data) { question_data.merge(type: 'MultipleChoiceQuestion') }
      let(:expected_record_attributes) { { type: 'MultipleChoiceQuestion' } }

      include_examples 'create resource', model_class: Question
    end

    context 'given data object with missing type' do
      let(:data) { question_data.except(:type) }

      include_examples 'fail to create resource',
                       model_class: Question, status: :unprocessable_entity
    end

    context 'given data object with non existing type' do
      let(:data) { question_data.merge(type: :non_existing_type) }

      include_examples 'fail to create resource',
                       model_class: Question, status: :unprocessable_entity
    end

    context 'given data object with text' do
      let(:data) do
        question_data.deep_merge(attributes: { text: 'My Question' })
      end
      let(:expected_record_attributes) { { text: 'My Question' } }

      include_examples 'create resource', model_class: Question
    end

    context 'given data object with missing text' do
      let(:data) { question_data.deep_merge(attributes: { text: nil }) }

      include_examples 'fail to create resource',
                       model_class: Question, status: :unprocessable_entity
    end

    describe 'interactive session' do
      let(:data_with_relationship) { question_data }
      let(:data_without_relationship) do
        question_data.deep_merge(relationships: { interactive_session: nil })
      end
      let(:related_record) { interactive_session }
      let(:other_record) { create(:interactive_session) }
      let(:query_key) { 'interactive_session_id' }
      let(:expected_record_attributes) do
        { interactive_session: interactive_session }
      end

      include_examples 'create resource with relationship', model_class: Question
    end
  end

  describe 'POST /interactive_sessions/:id/questions' do
    let(:interactive_session) { create(:interactive_session) }
    let(:data) do
      {
        type: 'SingleChoiceQuestion',
        attributes: {
          text: 'My Question'
        },
      }
    end
    let(:created_record) { Question.last }
    let(:expected_record_attributes) do
      { interactive_session: interactive_session }
    end

    def fire_post
      post "/interactive_sessions/#{interactive_session.id}/questions",
           params: { data: data }
    end

    include_examples 'create resource', model_class: Question
  end

  describe 'GET /questions/:id' do
    let!(:record) { create(:dummy_question) }

    def fire_get
      get "/questions/#{id}"
    end

    include_examples 'get resource', model_class: Question
  end

  describe 'PATCH /questions/:id' do
    let!(:record) { create(:dummy_question, text: 'My Question') }
    let(:updated_record) { Question.find(record.id) }
    let(:query_params) { '' }

    def fire_patch
      params = { data: data }
      patch "/questions/#{id}?#{query_params}", params: params
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'update resource', model_class: Question,
                                          expect_changes: false
    end

    context 'given text' do
      let(:data) { { attributes: { text: 'My Great Question' } } }
      let(:expected_record_attributes) { { text: 'My Great Question' } }

      include_examples 'update resource', model_class: Question
    end

    context 'given type' do
      let(:data) { { type: 'SingleChoiceQuestion' } }
      let(:expected_record_attributes) { { type: 'SingleChoiceQuestion' } }

      include_examples 'update resource', model_class: Question
    end

    context 'given interactive session as query param' do
      let(:interactive_session) { create(:interactive_session) }
      let(:data) { {} }
      let(:query_params) { "interactive_session_id=#{interactive_session.id}" }

      include_examples 'update resource', model_class: Question,
                                          expect_changes: false
    end
  end

  describe 'DELETE /questions/:id' do
    let!(:record) { create(:dummy_question) }

    def fire_delete
      delete "/questions/#{id}"
    end

    include_examples 'delete resource', model_class: Question
  end
end
