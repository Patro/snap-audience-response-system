# frozen_string_literal: true

class User < ApplicationRecord
  has_many :owned_interactive_sessions,
           class_name: 'InteractiveSession', foreign_key: :owner_id,
           inverse_of: :owner, dependent: :destroy
end
