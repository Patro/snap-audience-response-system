# frozen_string_literal: true

class QuestionsController < ApplicationController
  include Destroyable # destroy action
  include Listable # index action
  include Relatable
  include Viewable # show action

  def create
    # assign_attributes is used to bypass SubclassNotFound exception that
    # gets raised by the new method in case of an invalid type.
    # The type of a question is checked by a model validation instead
    # to provide better error messages.
    record = Question.new
    record.assign_attributes(params_for_creation)
    record.validate!
    authorize record

    record.save!

    render_record record: record, status: :created, location: question_url(record)
  end

  def update
    record = Question.find(record_id)
    authorize record

    record.update!(params_for_update)

    # After updating the record we are changing the class
    # of the question to match the given type attribute
    record = record.becomes(record.type.constantize)

    render_record record: record
  end

  private

    def apply_query_filters(records)
      if params[:interactive_session_id]
        return records.where(interactive_session_id: params[:interactive_session_id])
      end

      records
    end

    def params_for_creation
      mapped_params
    end

    def params_for_update
      mapped_params.slice(:type, :text)
    end

    def mapped_params
      {
        interactive_session_id: id_of_related_resource(:interactive_session),
        type: params.dig(:data, :type)&.camelize,
        text: params.dig(:data, :attributes, :text)
      }.compact
    end

    def record_class
      Question
    end
end
