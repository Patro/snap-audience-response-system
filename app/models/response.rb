# frozen_string_literal: true

class Response < ApplicationRecord
  self.primary_key = :poll_id, :respondent_id, :picked_question_option_id

  belongs_to :picked_question_option,
             class_name: 'QuestionOption', inverse_of: :responses
  belongs_to :poll
  belongs_to :respondent, class_name: 'User', inverse_of: :responses
end
