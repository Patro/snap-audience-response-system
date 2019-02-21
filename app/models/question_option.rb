# frozen_string_literal: true

class QuestionOption < ApplicationRecord
  belongs_to :question, inverse_of: :options
  has_many :responses,
           foreign_key: :picked_question_option_id,
           inverse_of: :picked_question_option, dependent: :destroy

  validates :text, presence: true
  validates :correct, inclusion: { in: [true, false] }
end
