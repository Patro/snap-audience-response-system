# frozen_string_literal: true

class QuestionOptionsController < ApplicationController
  def index
    records = policy_scope(QuestionOption)
    filtered_records = apply_query_filters(records)
    render_collection records: filtered_records
  end

  def create
    record = QuestionOption.new(mapped_params)
    record.validate!
    authorize record

    record.save!

    render_record record: record, status: :created,
                  location: question_option_url(record)
  end

  def show
    record = policy_scope(QuestionOption).find(params[:id])
    authorize record

    render_record record: record
  end

  def update
    record = find_question_option
    authorize record

    record.update!(mapped_params.slice(:text, :correct))

    render_record record: record
  end

  def destroy
    record = find_question_option
    authorize record

    record.destroy

    head :no_content
  end

  private

    def apply_query_filters(records)
      if params[:question_id]
        return records.where(question_id: params[:question_id])
      end

      records
    end

    def find_question_option
      QuestionOption.find(params[:id])
    end

    def question_id_from_query_params
      params[:question_id]
    end

    def question_id_from_relationships
      params.dig(:data, :relationships, :question, :data, :id)
    end

    def question_id
      unique_candidates = [
        question_id_from_query_params,
        question_id_from_relationships,
      ].compact.uniq

      if unique_candidates.count > 1
        raise Errors::UnprocessableEntityError,
              error_message: 'Given question id is ambiguous.'
      end

      unique_candidates.first
    end

    def mapped_params
      {
        question_id: question_id,
        text: params.dig(:data, :attributes, :text),
        correct: params.dig(:data, :attributes, :correct),
      }.compact
    end

    def serializer_class
      QuestionOptionSerializer
    end
end
