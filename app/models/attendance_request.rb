# frozen_string_literal: true

class AttendanceRequest
  include ActiveModel::Model

  attr_accessor :attendance_code, :requester

  validates :attendance_code, length: { is: 4 }
  validates :requester, presence: true
end
