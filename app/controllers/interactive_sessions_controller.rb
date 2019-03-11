# frozen_string_literal: true

class InteractiveSessionsController < ApplicationController
  include Destroyable # destroy action
  include Listable # index action
  include Updatable # update action
  include Viewable # show action

  def create
    record = InteractiveSession.new(params_for_creation)
    authorize record

    record = CreateInteractiveSessionService.new(record).call

    render_record record: record, status: :created, location: interactive_session_url(record)
  end

  private

    def params_for_creation
      mapped_params
    end

    def params_for_update
      mapped_params.slice(:label)
    end

    def mapped_params
      {
        label: params.dig(:data, :attributes, :label),
        owner: current_user,
      }.compact
    end

    def record_class
      InteractiveSession
    end
end
