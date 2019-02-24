# frozen_string_literal: true

class InteractiveSessionsController < ApplicationController
  def index
    render_collection records: policy_scope(InteractiveSession)
  end

  def create
    record = InteractiveSession.new(permitted_params_with_owner)
    authorize record

    record = CreateInteractiveSessionService.new(record).call

    render_record record: record, status: :created, location: interactive_session_url(record)
  end

  def show
    record = policy_scope(InteractiveSession).find(params[:id])
    authorize record

    render_record record: record
  end

  def update
    record = find_interactive_session
    authorize record

    record.update!(permitted_params)

    render_record record: record
  end

  def destroy
    record = find_interactive_session
    authorize record

    record.destroy

    head :no_content
  end

  private

    def find_interactive_session
      InteractiveSession.find(params[:id])
    end

    def permitted_params
      params.fetch(:data, {}).fetch(:attributes, {}).permit(:label)
    end

    def permitted_params_with_owner
      permitted_params.merge(owner: current_user)
    end

    def serializer_class
      InteractiveSessionSerializer
    end
end
