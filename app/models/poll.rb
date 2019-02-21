# frozen_string_literal: true

class Poll < ApplicationRecord
  belongs_to :question, inverse_of: :polls
  has_many :responses, inverse_of: :poll, dependent: :destroy

  validates :closed, inclusion: { in: [true, false] }
end
