# frozen_string_literal: true

class InteractiveSessionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.merge(user.interactive_sessions)
    end
  end

  def index?
    true
  end

  def create?
    true
  end

  def show?
    attendee_or_owner?
  end

  def show_attendance_code?
    owner?
  end

  def update?
    owner?
  end

  def destroy?
    owner?
  end

  private

    def attendee_or_owner?
      user.interactive_sessions.include?(record)
    end

    def owner?
      user.eql?(record.owner)
    end
end
