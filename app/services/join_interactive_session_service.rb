# frozen_string_literal: true

class JoinInteractiveSessionService < ApplicationService
  def initialize(attendance_request)
    @attendance_request = attendance_request
  end

  def call
    attendance_request.validate!
    create_attendance
  end

  private
    attr_reader :attendance_request

    def create_attendance
      Attendance.create!(
        attendee: attendance_request.requester,
        interactive_session: find_interactive_session!
      )
    end

    def find_interactive_session!
      interactive_session = InteractiveSession.find_by(
        attendance_code: attendance_request.attendance_code
      )
      if interactive_session.nil?
        raise Errors::UnprocessableEntityError,
              error_message: 'Attendance code does not match any interactive session.'
      end
      interactive_session
    end
end
