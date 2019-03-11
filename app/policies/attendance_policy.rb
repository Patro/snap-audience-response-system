# frozen_string_literal: true

class AttendancePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      own_attendances.or(attendances_of_owned_sessions)
    end

    private

      def own_attendances
        scope.where(attendee: user)
      end

      def attendances_of_owned_sessions
        scope.where(interactive_session: user.owned_interactive_sessions)
      end
  end

  def index?
    true
  end

  def create?
    true
  end

  def show?
    owner_of_session? || attendee?
  end

  def destroy?
    owner_of_session? || attendee?
  end

  private

    def attendee?
      user.eql?(record.attendee)
    end

    def owner_of_session?
      user.eql?(record.interactive_session.owner)
    end
end
