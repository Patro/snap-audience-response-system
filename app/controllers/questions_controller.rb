# frozen_string_literal: true

class QuestionsController < ApplicationController
  def index
    records = policy_scope(Question)
    filtered_records = apply_query_filters(records)
    render_collection records: filtered_records
  end

  def create
    # assign_attributes is used to bypass SubclassNotFound exception that
    # gets raised by the new method in case of an invalid type.
    # The type of a question is checked by a model validation instead
    # to provide better error messages.
    record = Question.new
    record.assign_attributes(mapped_params)
    record.validate!
    authorize record

    record.save!

    render_record record: record, status: :created, location: question_url(record)
  end

  def show
    record = policy_scope(Question).find(params[:id])
    authorize record

    render_record record: record
  end

  def update
    record = find_question
    authorize record

    record.update!(mapped_params.slice(:type, :text))

    # After updating the record we are changing the class
    # of the question to match the given type attribute
    record = record.becomes(record.type.constantize)

    render_record record: record
  end

  def destroy
    record = find_question
    authorize record

    record.destroy

    head :no_content
  end

  private

    def apply_query_filters(records)
      if params[:interactive_session_id]
        return records.where(interactive_session_id: params[:interactive_session_id])
      end

      records
    end

    def find_question
      Question.find(params[:id])
    end

    def interactive_session_id_from_query_params
      params[:interactive_session_id]
    end

    def interactive_session_id_from_relationships
      params.dig(:data, :relationships, :interactive_session, :data, :id)
    end

    def interactive_session_id
      unique_candidates = [
        interactive_session_id_from_query_params,
        interactive_session_id_from_relationships,
      ].compact.uniq

      if unique_candidates.count > 1
        raise Errors::UnprocessableEntityError,
              error_message: 'Given interactive session id is ambiguous.'
      end

      unique_candidates.first
    end

    def mapped_params
      {
        interactive_session_id: interactive_session_id,
        type: params.dig(:data, :type)&.camelize,
        text: params.dig(:data, :attributes, :text)
      }.compact
    end

    def serializer_class
      QuestionSerializer
    end
end
