# frozen_string_literal: true

class AttendanceSerializer < ApplicationSerializer
  belongs_to :interactive_session
end
