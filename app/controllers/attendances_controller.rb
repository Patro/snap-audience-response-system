# frozen_string_literal: true

class AttendancesController < ApplicationController
  include Destroyable # destroy action
  include Listable # index action
  include Viewable # show action

  def create
    authorize Attendance.new

    attendance_request = AttendanceRequest.new(
      requester: current_user,
      attendance_code: attendance_code
    )
    attendance = JoinInteractiveSessionService.new(attendance_request).call

    render_record record: attendance, status: :created, location: attendance_url(attendance)
  end

  private

    def apply_query_filters(records)
      if params[:interactive_session_id]
        return records.where(interactive_session_id: params[:interactive_session_id])
      end

      records
    end

    def attendance_code
      params.fetch(:data, {}).fetch(:attributes, {}).fetch(:attendance_code)
    end

    def record_id
      params[:id].split(',')
    end

    def record_class
      Attendance
    end
end
