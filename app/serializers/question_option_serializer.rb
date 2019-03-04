# frozen_string_literal: true

class QuestionOptionSerializer < ApplicationSerializer
  belongs_to :question, polymorphic: true
  attributes :text
  attributes :correct, if: Proc.new { |record, params|
    Pundit.policy!(params[:current_user], record).show_correct_flag?
  }
end
