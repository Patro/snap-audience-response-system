# frozen_string_literal: true

class QuestionSerializer < ApplicationSerializer
  belongs_to :interactive_session
  has_many :options, record_type: :question_option do |record, params|
    policy_scope = Pundit.policy_scope!(params[:current_user], QuestionOption)
    record.options.merge(policy_scope)
  end
  attributes :text, :type
end
