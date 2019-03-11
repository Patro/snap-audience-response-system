# frozen_string_literal: true

module Creatable
  def create
    record = record_class.new(params_for_creation)
    record.validate!
    authorize record

    record.save!

    render_record record: record, status: :created, location: polymorphic_url(record)
  end

  private

    def params_for_creation
      raise NotImplementedError
    end
end
