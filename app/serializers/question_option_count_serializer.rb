# frozen_string_literal: true

class QuestionOptionCountSerializer < ApplicationSerializer
  belongs_to :poll
  belongs_to :question_option
  attributes :number_of_responses
end
