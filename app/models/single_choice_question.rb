# frozen_string_literal: true

class SingleChoiceQuestion < Question
  def self.policy_class
    QuestionPolicy
  end
end
