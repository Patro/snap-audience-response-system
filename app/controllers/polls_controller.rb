# frozen_string_literal: true

class PollsController < ApplicationController
  include Creatable # create action
  include Destroyable # destroy action
  include Listable # index action
  include Relatable
  include Updatable # update action
  include Viewable # show action

  private

    def apply_interactive_session_filter(records)
      return records unless params[:interactive_session_id].present?

      records.joins(:question).merge(
        Question.where(interactive_session_id: params[:interactive_session_id])
      )
    end

    def apply_question_filter(records)
      return records unless params[:question_id].present?

      records.where(question_id: params[:question_id])
    end

    def apply_status_filter(records)
      return records unless params[:status].present?

      case params[:status]
      when 'open'
        records.where(closed: false)
      when 'closed'
        records.where(closed: true)
      else
        records
      end
    end

    def apply_responded_filter(records)
      return records unless params[:responded].present?

      case params[:responded]
      when 'true'
        records.responded_by(current_user)
      when 'false'
        records.not_responded_by(current_user)
      else
        records
      end
    end

    def apply_query_filters(records)
      records = apply_interactive_session_filter(records)
      records = apply_question_filter(records)
      records = apply_status_filter(records)
      records = apply_responded_filter(records)
      records
    end

    def params_for_creation
      mapped_params
    end

    def params_for_update
      mapped_params.slice(:closed)
    end

    def mapped_params
      {
        question_id: id_of_related_resource(:question),
        closed: closed_flag,
      }.compact
    end

    def closed_flag
      case params.dig(:data, :attributes, :status)
      when 'open'
        false
      when 'closed'
        true
      when nil
        nil
      else
        raise Errors::UnprocessableEntityError,
              error_message: 'Given status is unknown.'
      end
    end

    def record_class
      Poll
    end
end
