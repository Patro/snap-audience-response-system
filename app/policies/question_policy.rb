# frozen_string_literal: true

class QuestionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      with_owned_session.or(with_attended_session_and_poll)
    end

    private

      def with_session
        scope.joins(:interactive_session)
      end

      def with_owned_session
        with_session.merge(user.owned_interactive_sessions)
      end

      def with_attended_session_and_poll
        subquery = with_session.joins(:polls)
                               .merge(user.attended_interactive_sessions)
        with_session.where(id: subquery)
      end
  end

  def index?
    true
  end

  def create?
    owner_of_session?
  end

  def show?
    owner_of_session? || (attendee_of_session? && record.polls.any?)
  end

  def update?
    owner_of_session?
  end

  def destroy?
    owner_of_session?
  end

  private

    def owner_of_session?
      record.interactive_session.owner?(user)
    end

    def attendee_of_session?
      record.interactive_session.attendee?(user)
    end
end
