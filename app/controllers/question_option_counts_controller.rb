# frozen_string_literal: true

class QuestionOptionCountsController < ApplicationController
  def index
    authorize QuestionOptionCount.new(poll: find_poll)

    service = CalculateQuestionOptionCountsService.new(find_poll)
    render_collection records: service.call
  end

  private
    def find_poll
      @poll ||= Poll.find(params[:poll_id])
    end

    def record_class
      QuestionOptionCount
    end
end
