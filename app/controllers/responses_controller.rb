# frozen_string_literal: true

class ResponsesController < ApplicationController
  include Relatable

  def index
    records = policy_scope(Response)
    filtered_records = apply_query_filters(records)
    render_collection records: filtered_records
  end

  def create
    record = Response.new(mapped_params)
    record.validate!
    authorize record

    record.save!

    render_record record: record, status: :created, location: response_url(record)
  end

  def show
    record = policy_scope(Response).find(response_id)
    authorize record

    render_record record: record
  end

  private

    def apply_query_filters(records)
      if params[:poll_id]
        return records.where(poll_id: params[:poll_id])
      end

      records
    end

    def response_id
      params[:id].split(',')
    end

    def serializer_class
      ResponseSerializer
    end

    def mapped_params
      {
        poll_id: id_of_related_resource(:poll),
        picked_question_option_id: id_of_related_resource(:picked_question_option),
        respondent: current_user,
      }.compact
    end
end
