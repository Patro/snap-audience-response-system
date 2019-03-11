# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Question Options API', type: :request do
  include RequestHelpers

  describe 'GET /question_options' do
    let!(:records) { create_list(:question_option, 2) }

    def fire_get
      get '/question_options'
    end

    include_examples 'get collection of resources',
                      model_class: QuestionOption
  end

  describe 'GET /question_options?question=' do
    let(:question) { create(:dummy_question) }
    let!(:records) { create_list(:question_option, 2, question: question) }
    let!(:non_matching_records) { create_list(:question_option, 2) }

    def fire_get
      get "/question_options?question_id=#{question.id}"
    end

    include_examples 'get collection of resources',
                      model_class: QuestionOption, with_filter: true
  end

  describe 'GET /questions/:id/question_options' do
    let(:question) { create(:dummy_question) }
    let!(:records) { create_list(:question_option, 2, question: question) }
    let!(:non_matching_records) { create_list(:question_option, 2) }

    def fire_get
      get "/questions/#{question.id}/question_options"
    end

    include_examples 'get collection of resources',
                      model_class: QuestionOption, with_filter: true
  end

  describe 'POST /question_options' do
    let(:question) { create(:dummy_question) }
    let(:option_data) do
      {
        type: 'QuestionOption',
        attributes: {
          text: 'My Option',
          correct: false,
        },
        relationships: {
          question: {
            data: { id: question.id, type: :dummy_question },
          },
        },
      }
    end
    let(:created_record) { QuestionOption.last }
    let(:query_params) { '' }

    def fire_post
      post "/question_options?#{query_params}", params: { data: data }
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'fail to create resource',
                       model_class: QuestionOption,
                       status: :unprocessable_entity
    end

    context 'given data object with text' do
      let(:data) do
        option_data.deep_merge(attributes: { text: 'My fancy Option' })
      end
      let(:expected_record_attributes) { { text: 'My fancy Option' } }

      include_examples 'create resource', model_class: QuestionOption
    end

    context 'given data object with missing text' do
      let(:data) { option_data.deep_merge(attributes: { text: nil }) }

      include_examples 'fail to create resource',
                       model_class: QuestionOption,
                       status: :unprocessable_entity
    end

    context 'given data object with correct flag' do
      let(:data) { option_data.deep_merge(attributes: { correct: 'true' }) }
      let(:expected_record_attributes) { { correct: true } }

      include_examples 'create resource', model_class: QuestionOption
    end

    context 'given data object with missing correct flag' do
      let(:data) { option_data.deep_merge(attributes: { correct: nil }) }

      include_examples 'fail to create resource',
                       model_class: QuestionOption,
                       status: :unprocessable_entity
    end

    describe 'question' do
      let(:data_with_relationship) { option_data }
      let(:data_without_relationship) do
        option_data.deep_merge(relationships: { question: nil })
      end
      let(:related_record) { question }
      let(:other_record) { create(:dummy_question) }
      let(:query_key) { 'question_id' }
      let(:expected_record_attributes) { { question: question } }

      include_examples 'create resource with relationship',
                       model_class: QuestionOption
    end
  end

  describe 'POST /questions/:id/question_options' do
    let(:question) { create(:dummy_question) }
    let(:data) do
      {
        type: 'QuestionOption',
        attributes: {
          text: 'My Option',
          correct: 'true',
        },
      }
    end
    let(:created_record) { QuestionOption.last }
    let(:expected_record_attributes) do
      { question: question }
    end

    def fire_post
      post "/questions/#{question.id}/question_options",
           params: { data: data }
    end

    include_examples 'create resource', model_class: QuestionOption
  end

  describe 'GET /question_options/:id' do
    let!(:record) { create(:question_option) }

    def fire_get
      get "/question_options/#{id}"
    end

    include_examples 'get resource', model_class: QuestionOption
  end

  describe 'PATCH /question_optionss/:id' do
    let!(:record) { create(:question_option) }
    let(:updated_record) { QuestionOption.find(record.id) }
    let(:query_params) { '' }

    def fire_patch
      params = { data: data }
      patch "/question_options/#{id}?#{query_params}", params: params
    end

    context 'given empty data object' do
      let(:data) { {} }

      include_examples 'update resource', model_class: QuestionOption,
                                          expect_changes: false
    end

    context 'given text' do
      let(:data) { { attributes: { text: 'My Great Option' } } }
      let(:expected_record_attributes) { { text: 'My Great Option' } }

      include_examples 'update resource', model_class: QuestionOption
    end

    context 'given correct' do
      let(:data) { { attributes: { correct: 'false' } } }
      let(:expected_record_attributes) { { correct: false } }

      include_examples 'update resource', model_class: QuestionOption
    end

    context 'given question' do
      let(:question) { create(:dummy_question) }
      let(:data) { {} }
      let(:query_params) { "question_id=#{question.id}" }

      include_examples 'update resource', model_class: QuestionOption,
                                          expect_changes: false
    end
  end

  describe 'DELETE /question_options/:id' do
    let!(:record) { create(:question_option) }

    def fire_delete
      delete "/question_options/#{id}"
    end

    include_examples 'delete resource', model_class: QuestionOption
  end
end
