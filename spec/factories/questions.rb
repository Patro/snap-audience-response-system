# frozen_string_literal: true

class DummyQuestion < Question
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
  end
end
