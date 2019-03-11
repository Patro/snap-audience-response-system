# frozen_string_literal: true

class QuestionSerializer < ApplicationSerializer
  belongs_to :interactive_session
  has_many :options, record_type: :question_option do |record, params|
    policy_scope = Pundit.policy_scope!(params[:current_user], QuestionOption)
    record.options.merge(policy_scope)
  end
  attributes :text

  class << self
    def record_hash(record, fieldset, params = {})
      return super if record.type.blank?

      type_serializer = (record.type + 'Serializer').constantize
      return super if ancestors.include?(type_serializer)

      type_serializer.record_hash(record, fieldset, params)
    rescue NameError
      record_hash = super
      record_hash[:type] = record.type.underscore.to_sym
      record_hash
    end
  end
end
