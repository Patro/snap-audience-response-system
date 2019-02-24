# frozen_string_literal: true

class Poll < ApplicationRecord
  belongs_to :question, inverse_of: :polls

  validates :closed, inclusion: { in: [true, false] }
end
