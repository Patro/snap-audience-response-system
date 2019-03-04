# frozen_string_literal: true

class QuestionSerializer < ApplicationSerializer
  belongs_to :interactive_session
  attributes :text, :type
end
