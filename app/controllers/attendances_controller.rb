# frozen_string_literal: true

class AttendancesController < ApplicationController
  def index
    records = policy_scope(Attendance)
    filtered_records = apply_query_filters(records)
    render_collection records: filtered_records
  end

  def create
    authorize Attendance.new

    attendance_request = AttendanceRequest.new(
      requester: current_user,
      attendance_code: attendance_code
    )
    attendance = JoinInteractiveSessionService.new(attendance_request).call

    render_record record: attendance, status: :created, location: attendance_url(attendance)
  end

  def show
    record = policy_scope(Attendance).find(attendance_id)
    authorize record

    render_record record: record
  end

  def destroy
    record = find_attendance
    authorize record

    record.destroy

    head :no_content
  end

  private

    def apply_query_filters(records)
      if params[:interactive_session_id]
        return records.where(interactive_session_id: params[:interactive_session_id])
      end

      records
    end

    def attendance_id
      params[:id].split(',')
    end

    def attendance_code
      params.fetch(:data, {}).fetch(:attributes, {}).fetch(:attendance_code)
    end

    def find_attendance
      Attendance.find(attendance_id)
    end

    def serializer_class
      AttendanceSerializer
    end
end
