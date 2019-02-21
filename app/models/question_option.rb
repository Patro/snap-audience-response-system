# frozen_string_literal: true

class QuestionOption < ApplicationRecord
  belongs_to :question, inverse_of: :options

  validates :text, presence: true
  validates :correct, inclusion: { in: [true, false] }
end
