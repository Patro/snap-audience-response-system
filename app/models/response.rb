# frozen_string_literal: true

class Response < ApplicationRecord
  self.primary_key = :poll_id, :respondent_id, :picked_question_option_id

  belongs_to :picked_question_option,
             class_name: 'QuestionOption', inverse_of: :responses
  belongs_to :poll
  belongs_to :respondent, class_name: 'User', inverse_of: :responses
  has_one :interactive_session, through: :poll

  after_create :broadcast_create_event

  private

    def broadcast_create_event
      broadcast_event('RESPONSE_CREATED')
    end

    def broadcast_event(type)
      ApplicationCable::InteractiveSessionChannel.broadcast_to(
        interactive_session,
        event: { type: type, poll_id: poll.id.to_s, response_id: id.to_s }
      )
    end
end
