# frozen_string_literal: true

class PollPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.joins(question: :interactive_session).merge(interactive_session_scope)
    end

    private

      def interactive_session_scope
        Pundit.policy_scope!(user, InteractiveSession)
      end
  end

  def index?
    true
  end

  def create?
    owner_of_session?
  end

  def show?
    owner_of_session? || attendee_of_session?
  end

  def update?
    owner_of_session?
  end

  def destroy?
    owner_of_session?
  end

  private

    def attendee_of_session?
      interactive_session.attendee?(user)
    end

    def owner_of_session?
      interactive_session.owner?(user)
    end

    def interactive_session
      record.question.interactive_session
    end
end
