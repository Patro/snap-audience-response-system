# frozen_string_literal: true

class DummyQuestion < Question
  def self.policy_class
    QuestionPolicy
  end

  private

    def available_types
      super + %w(DummyQuestion)
    end
end

FactoryBot.define do
  factory :question do
    interactive_session
    text { 'What is the answer of all questions?' }

    factory :dummy_question, class: 'DummyQuestion' do
    end

    factory :multiple_choice_question, class: 'MultipleChoiceQuestion' do
    end

    factory :single_choice_question, class: 'SingleChoiceQuestion' do
    end
  end
end
