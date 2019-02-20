# frozen_string_literal: true

class InteractiveSession < ApplicationRecord
  belongs_to :owner, class_name: 'User', inverse_of: :owned_interactive_sessions

  validates :attendance_code, length: { is: 4, allow_nil: true }
end
