# frozen_string_literal: true

class QuestionOptionCount
  include ActiveModel::Model

  attr_accessor :number_of_responses, :poll_id, :question_option_id

  def id
    return unless poll_id.present? && question_option_id.present?

    [poll_id, question_option_id].join(',')
  end

  def poll
    return unless poll_id.present?

    Poll.find(poll_id)
  end

  def poll=(poll)
    self.poll_id = poll&.id
  end

  def question_option
    return unless question_option_id.present?

    QuestionOption.find(question_option_id)
  end

  def question_option=(question_option)
    self.question_option_id = question_option&.id
  end

  def eql?(other)
    attributes.eql?(other.attributes)
  end
  alias_method :==, :eql?

  protected
    def attributes
      {
        number_of_responses: number_of_responses,
        poll_id: poll_id,
        question_option_id: question_option_id
      }
    end
end
