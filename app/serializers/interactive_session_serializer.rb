# frozen_string_literal: true

class InteractiveSessionSerializer < ApplicationSerializer
  attributes :label
  attributes :attendance_code, if: Proc.new { |record, params|
    Pundit.policy!(params[:current_user], record).show_attendance_code?
  }
end
