# frozen_string_literal: true

class CreateInteractiveSessionService < ApplicationService
  def initialize(interactive_session)
    @interactive_session = interactive_session.dup
    @attempts = 0
  end

  def call
    create_interactive_session
  rescue ActiveRecord::RecordNotUnique
    retry_or_reraise
  end

  private
    MAX_ATTEMPTS = 10

    attr_reader :interactive_session

    def create_interactive_session
      interactive_session.attendance_code = generate_attendance_code
      interactive_session.save!
      interactive_session
    end

    def generate_attendance_code
      code = SecureRandom.alphanumeric.tr('0-9', '').upcase[0..3]
      return code if code.length == 4

      generate_attendance_code
    end

    def retry_or_reraise
      @attempts += 1
      max_attempts_reached? ? raise : call
    end

    def max_attempts_reached?
      @attempts > MAX_ATTEMPTS
    end
end
