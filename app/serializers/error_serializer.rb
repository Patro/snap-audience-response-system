# frozen_string_literal: true

class ErrorSerializer < ApplicationSerializer
  set_id :title
  attributes :title, :detail
  attributes :status do |record|
    Rack::Utils.status_code(record.status).to_s
  end

  def hash_for_one_record
    errors = [super.dig(:data, :attributes)].compact
    { errors: errors }
  end

  def hash_for_collection
    { errors: super[:data]&.map { |error| error[:attributes] } }
  end
end
