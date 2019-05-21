# frozen_string_literal: true

class ResponsePolicy < ApplicationPolicy
  def create?
    owner_of_session? || attendee_of_session?
  end

  private

    def attendee_of_session?
      interactive_session.attendee?(user)
    end

    def owner_of_session?
      interactive_session.owner?(user)
    end

    def interactive_session
      record.poll.question.interactive_session
    end
end
