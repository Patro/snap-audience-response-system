# frozen_string_literal: true

api_mime_types = %W(
  application/json
  text/x-json
  application/jsonrequest
)
Mime::Type.register 'application/vnd.api+json', :json, api_mime_types
