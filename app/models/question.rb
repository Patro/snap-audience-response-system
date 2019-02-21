# frozen_string_literal: true

class Question < ApplicationRecord
  belongs_to :interactive_session, inverse_of: :questions
  has_many :options, class_name: 'QuestionOption', inverse_of: :question,
                     dependent: :destroy

  validates :type, presence: true, inclusion: { in: :available_types }
  validates :text, presence: true

  private

    def available_types
      %w[MultipleChoiceQuestion SingleChoiceQuestion]
    end
end
