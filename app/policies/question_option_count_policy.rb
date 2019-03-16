# frozen_string_literal: true

class QuestionOptionCountPolicy < ApplicationPolicy
  def index?
    owner_of_session? || poll_closed?
  end

  private

    def owner_of_session?
      user.eql?(record.poll.question.interactive_session.owner)
    end

    def poll_closed?
      record.poll.closed?
    end
end
