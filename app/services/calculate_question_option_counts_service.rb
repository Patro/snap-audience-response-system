# frozen_string_literal: true

class CalculateQuestionOptionCountsService < ApplicationService
  def initialize(poll)
    @poll = poll
  end

  def call
    poll.question.options.map do |question_option|
      build_count_for(question_option)
    end
  end

  private
    attr_accessor :poll

    def build_count_for(question_option)
      QuestionOptionCount.new(
        poll: poll,
        question_option: question_option,
        number_of_responses: calculate_number_of_responses_for(question_option)
      )
    end

    def calculate_number_of_responses_for(question_option)
      question_option.responses.where(poll: poll).count
    end
end
