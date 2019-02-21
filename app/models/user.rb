# frozen_string_literal: true

class User < ApplicationRecord
  has_many :attendances,
           foreign_key: :attendee_id, inverse_of: :attendee,
           dependent: :destroy
  has_many :attended_interactive_sessions,
           through: :attendances, source: :interactive_session
  has_many :owned_interactive_sessions,
           class_name: 'InteractiveSession', foreign_key: :owner_id,
           inverse_of: :owner, dependent: :destroy
  has_many :responses, foreign_key: :respondent_id, inverse_of: :respondent, dependent: :destroy
end
