# frozen_string_literal: true

class AttendancePolicy < ApplicationPolicy
  def create?
    true
  end
end
