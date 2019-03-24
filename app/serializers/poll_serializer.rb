# frozen_string_literal: true

class PollSerializer < ApplicationSerializer
  belongs_to :question, polymorphic: true
  attributes :status
end
