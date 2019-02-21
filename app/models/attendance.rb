# frozen_string_literal: true

class Attendance < ApplicationRecord
  belongs_to :attendee, class_name: 'User'
  belongs_to :interactive_session
end
