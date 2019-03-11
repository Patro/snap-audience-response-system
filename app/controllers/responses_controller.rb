# frozen_string_literal: true

class ResponsesController < ApplicationController
  include Creatable # create action
  include Listable # index action
  include Relatable
  include Viewable # show action

  private

    def apply_query_filters(records)
      if params[:poll_id]
        return records.where(poll_id: params[:poll_id])
      end

      records
    end

    def params_for_creation
      mapped_params
    end

    def mapped_params
      {
        poll_id: id_of_related_resource(:poll),
        picked_question_option_id: id_of_related_resource(:picked_question_option),
        respondent: current_user,
      }.compact
    end

    def record_id
      params[:id].split(',')
    end

    def record_class
      Response
    end
end
