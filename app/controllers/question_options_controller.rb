# frozen_string_literal: true

class QuestionOptionsController < ApplicationController
  include Creatable # create action
  include Destroyable # destroy action
  include Listable # index action
  include Relatable
  include Updatable # update action
  include Viewable # show action

  private

    def apply_query_filters(records)
      if params[:question_id]
        return records.where(question_id: params[:question_id])
      end

      records
    end

    def params_for_creation
      mapped_params
    end

    def params_for_update
      mapped_params.slice(:text, :correct, :position)
    end

    def mapped_params
      {
        question_id: id_of_related_resource(:question),
        text: params.dig(:data, :attributes, :text),
        correct: params.dig(:data, :attributes, :correct),
        position: params.dig(:data, :attributes, :position),
      }.compact
    end

    def record_class
      QuestionOption
    end
end
