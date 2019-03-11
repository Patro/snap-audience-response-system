# frozen_string_literal: true

module Listable
  def index
    records = policy_scope(record_class)
    filtered_records = apply_query_filters(records)
    render_collection records: filtered_records
  end

  private

    def apply_query_filters(records)
      records
    end
end
