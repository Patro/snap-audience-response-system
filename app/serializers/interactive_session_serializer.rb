# frozen_string_literal: true

class InteractiveSessionSerializer < ApplicationSerializer
  has_many :questions, polymorphic: true do |record, params|
    policy_scope = Pundit.policy_scope!(params[:current_user], Question)
    record.questions.merge(policy_scope)
  end
  attributes :label
  attributes :attendance_code, if: Proc.new { |record, params|
    Pundit.policy!(params[:current_user], record).show_attendance_code?
  }
  attributes :role do |record, params|
    record.role_of(params[:current_user])
  end
end
