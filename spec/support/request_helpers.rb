# frozen_string_literal: true

module RequestHelpers
  extend ActiveSupport::Concern

  def default_headers
    { 'ACCEPT' => 'application/vnd.api+json' }
  end

  def apply_default_headers(headers)
    headers.reverse_merge(default_headers)
  end

  [:head, :get, :post, :patch, :delete].each do |method_sym|
    define_method method_sym do |action, headers: {}, **args|
      super(action, **args, headers: apply_default_headers(headers))
    end
  end

  def json
    JSON.parse(response.body)
  end
end
