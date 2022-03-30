# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.1'

gem 'rails', '~> 5.2.2'
gem 'pg' # interface to PostgreSQL
gem 'puma', '~> 4.3' # web server
gem 'redis', '~> 4.0' # for Action Cable in production
gem 'bootsnap', '>= 1.1.0', require: false # reduces boot time
gem 'composite_primary_keys', '~> 11.0' # composite primary keys support for Active Record
gem 'pundit' # authorization system
gem 'fast_jsonapi' # JSON:API serializer
gem 'sentry-raven' # error tracking

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw] # debugger console
  gem 'rspec-rails', '~> 3.8' # RSpec testing framework
  gem 'action-cable-testing' # Action Cable testing utils
  gem 'capybara' # acceptance test framework
  gem 'selenium-webdriver' # W3C WebDriver client
  gem 'factory_bot_rails' # to setup ruby objects for testing
  gem 'database_cleaner' # set of strategies for cleaning databases
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring' # speeds up development
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'rubocop', require: false
  gem 'rubocop-rails_config'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
