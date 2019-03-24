# frozen_string_literal: true

class Poll < ApplicationRecord
  belongs_to :question, inverse_of: :polls
  has_many :responses, inverse_of: :poll, dependent: :destroy
  has_one :interactive_session, through: :question

  validates :closed, inclusion: { in: [true, false] }

  after_create :broadcast_create_event
  after_update :broadcast_update_event
  after_destroy :broadcast_destroy_event

  def status
    return :closed if closed?
    :open
  end

  private

    def broadcast_create_event
      broadcast_event('POLL_CREATED')
    end

    def broadcast_destroy_event
      broadcast_event('POLL_DESTROYED')
    end

    def broadcast_update_event
      broadcast_event('POLL_UPDATED')
    end

    def broadcast_event(type)
      ApplicationCable::InteractiveSessionChannel.broadcast_to(
        interactive_session,
        event: { type: type, poll_id: id.to_s }
      )
    end
end
