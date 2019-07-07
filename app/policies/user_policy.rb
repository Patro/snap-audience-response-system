# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      own_user_record.or(attendees_of_owned_sessions)
    end

    private

      def own_user_record
        scope.where(id: user)
      end

      def attendees_of_owned_sessions
        attendances = Attendance.where(interactive_session: user.owned_interactive_sessions)
        scope.where(id: attendances.select(:attendee_id))
      end
  end

  def index?
    true
  end

  def show?
    own_user_record? || attendee_of_owned_session?
  end

  def update?
    own_user_record?
  end

  private

    def own_user_record?
      record.eql?(user)
    end

    def attendee_of_owned_session?
      record
        .attendances
        .where(interactive_session: user.owned_interactive_sessions)
        .any?
    end
end
