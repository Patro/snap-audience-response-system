# frozen_string_literal: true

class Attendance < ApplicationRecord
  self.primary_key = :attendee_id, :interactive_session_id

  belongs_to :attendee, class_name: 'User', inverse_of: :attendances
  belongs_to :interactive_session, inverse_of: :attendances
end
