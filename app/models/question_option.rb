# frozen_string_literal: true

class QuestionOption < ApplicationRecord
  belongs_to :question, inverse_of: :options
  has_many :responses,
           foreign_key: :picked_question_option_id,
           inverse_of: :picked_question_option, dependent: :destroy

  default_scope { order(:position) }

  validates :text, presence: true
  validates :correct, inclusion: { in: [true, false] }
  validates :position, numericality: { greater_than_or_equal_to: 0 }
end
