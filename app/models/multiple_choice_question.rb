# frozen_string_literal: true

class MultipleChoiceQuestion < Question
  def self.policy_class
    QuestionPolicy
  end
end
