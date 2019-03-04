# frozen_string_literal: true

class ResponseSerializer < ApplicationSerializer
  belongs_to :poll
  belongs_to :picked_question_option, record_type: :question_option
end
