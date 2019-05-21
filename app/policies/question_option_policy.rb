# frozen_string_literal: true

class QuestionOptionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.joins(:question).merge(question_scope)
    end

    private

      def question_scope
        Pundit.policy_scope!(user, Question)
      end
  end

  def index?
    true
  end

  def create?
    owner_of_session?
  end

  def show?
    question_policy.show?
  end

  def show_correct_flag?
    owner_of_session?
  end

  def update?
    question_policy.update?
  end

  def destroy?
    question_policy.destroy?
  end

  private

    def owner_of_session?
      record.question.interactive_session.owner?(user)
    end

    def question_policy
      Pundit.policy!(user, record.question)
    end
end
