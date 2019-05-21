# frozen_string_literal: true

class InteractiveSession < ApplicationRecord
  belongs_to :owner, class_name: 'User', inverse_of: :owned_interactive_sessions
  has_many :attendances, inverse_of: :interactive_session, dependent: :destroy
  has_many :attendees, through: :attendances
  has_many :questions, inverse_of: :interactive_session, dependent: :destroy
  has_many :polls, through: :questions

  validates :attendance_code, length: { is: 4, allow_nil: true }

  def attendee?(user)
    attendees.where(id: user).count.positive?
  end

  def owner?(user)
    user.eql?(owner)
  end

  def role_of(user)
    return :owner if owner?(user)
    return :attendee if attendee?(user)

    :none
  end
end
