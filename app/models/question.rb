# frozen_string_literal: true

class Question < ApplicationRecord
  belongs_to :interactive_session, inverse_of: :questions

  validates :type, presence: true, inclusion: { in: :available_types }
  validates :text, presence: true

  private

    def available_types
      %w[MultipleChoiceQuestion]
    end
end
