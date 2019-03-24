# frozen_string_literal: true

class PollSerializer < ApplicationSerializer
  belongs_to :question, polymorphic: true
  attributes :status
  attributes :responded do |record, params|
    record.responded_by?(params[:current_user])
  end
end
