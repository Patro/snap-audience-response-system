# frozen_string_literal: true

class PollsController < ApplicationController
  def index
    records = policy_scope(Poll)
    filtered_records = apply_query_filters(records)
    render_collection records: filtered_records
  end

  def create
    record = Poll.new(mapped_params)
    record.validate!
    authorize record

    record.save!

    render_record record: record, status: :created, location: poll_url(record)
  end

  def show
    record = policy_scope(Poll).find(params[:id])
    authorize record

    render_record record: record
  end

  def update
    record = find_poll
    authorize record

    record.update!(mapped_params.slice(:closed))

    render_record record: record
  end

  def destroy
    record = find_poll
    authorize record

    record.destroy

    head :no_content
  end

  private

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

    def apply_query_filters(records)
      records = apply_question_filter(records)
      records = apply_status_filter(records)
      records
    end

    def find_poll
      Poll.find(params[:id])
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
        closed: params.dig(:data, :attributes, :closed),
      }.compact
    end

    def serializer_class
      PollSerializer
    end
end
