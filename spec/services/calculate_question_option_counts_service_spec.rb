# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CalculateQuestionOptionCountsService do
  let(:question) { create(:dummy_question) }
  let(:question_options) do
    create_list(:question_option, 2, question: question)
  end
  let(:poll) { create(:poll, question: question) }
  let(:service) do
    CalculateQuestionOptionCountsService.new(poll)
  end

  context 'given no responses' do
    subject { service.call }

    it 'should return two counts with number of responses set to 0' do
      first_count = build(:question_option_count,
                          poll: poll,
                          question_option: question_options[0],
                          number_of_responses: 0)
      second_count = build(:question_option_count,
                           poll: poll,
                           question_option: question_options[1],
                           number_of_responses: 0)

      is_expected.to match_array([first_count, second_count])
    end
  end

  context 'given response for first option' do
    before do
      create(:response,
             poll: poll,
             picked_question_option: question_options[0])
    end

    subject { service.call }

    it 'should return two counts with number of responses set to 0 and 1' do
      first_count = build(:question_option_count,
                          poll: poll,
                          question_option: question_options[0],
                          number_of_responses: 1)
      second_count = build(:question_option_count,
                           poll: poll,
                           question_option: question_options[1],
                           number_of_responses: 0)

      is_expected.to match_array([first_count, second_count])
    end
  end
end
