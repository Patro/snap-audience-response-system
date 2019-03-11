# frozen_string_literal: true

module Destroyable
  def destroy
    record = record_class.find(record_id)
    authorize record

    record.destroy

    head :no_content
  end
end
