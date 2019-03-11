# frozen_string_literal: true

module Updatable
  def update
    record = record_class.find(record_id)
    authorize record

    record.update!(params_for_update)

    render_record record: record
  end

  private

    def params_for_update
      raise NotImplementedError
    end
end
