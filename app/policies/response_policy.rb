# frozen_string_literal: true

class ResponsePolicy < ApplicationPolicy
  def create?
    owner_of_session? || attendee_of_session?
  end

  private

    def attendee_of_session?
      user.attended_interactive_sessions.include?(interactive_session)
    end

    def owner_of_session?
      user.eql?(interactive_session.owner)
    end

    def interactive_session
      record.poll.question.interactive_session
    end
end
