# frozen_string_literal: true

module Viewable
  def show
    record = policy_scope(record_class).find(record_id)
    authorize record

    render_record record: record
  end
end
