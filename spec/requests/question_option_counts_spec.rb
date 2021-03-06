# frozen_string_literal: true

require 'rails_helper'
require 'support/request_shared_examples'

RSpec.describe 'Question Option Counts API', type: :request do
  include RequestHelpers

  def self.test_get_request(url)
    describe "GET #{url}" do
      let(:question) { create(:dummy_question) }
      let(:question_option) { create(:question_option, question: question) }
      let(:poll) { create(:poll, question: question) }
      let!(:responses) do
        create_list(:response, 2, poll: poll,
                                  picked_question_option: question_option)
      end
      let(:records) do
        [
          build(:question_option_count, poll: poll,
                                        question_option: question_option,
                                        number_of_responses: 2)
        ]
      end

      define_method :fire_get do
        get url.sub(':poll_id', poll.id.to_s)
      end

      context 'given policy that permits action' do
        permit_action(QuestionOptionCount, :index?)

        before(:each) { fire_get }

        describe 'response' do
          subject { response }

          it { is_expected.to have_http_status(:ok) }
          it { is_expected.to have_json_api_content_type }

          describe 'meta' do
            subject { json['meta'] }

            it { is_expected.to include('total' => records.length) }
          end

          describe 'data' do
            subject { json['data'] }

            it { is_expected.to include_identifier_of(records) }
          end
        end
      end

      context 'given policy that denies action' do
        deny_action(QuestionOptionCount, :index?)

        before(:each) { fire_get }

        describe 'response' do
          subject { response }

          it { is_expected.to have_http_status(:forbidden) }
          it { is_expected.to have_json_api_content_type }
        end
      end
    end
  end

  test_get_request('/api/polls/:poll_id/question_option_counts')
  test_get_request('/api/question_option_counts?poll_id=:poll_id')
end
