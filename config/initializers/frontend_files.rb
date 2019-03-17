# frozen_string_literal: true

if Rails.application.config.public_file_server.enabled
  build_folder = "#{Rails.root}/frontend/build"
  Rails.application.middleware.use ::ActionDispatch::Static, build_folder
end
