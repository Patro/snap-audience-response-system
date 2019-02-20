source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.1'

gem 'rails', '~> 5.2.2'
gem 'pg' # interface to PostgreSQL
gem 'puma', '~> 3.11' # web server
gem 'redis', '~> 4.0' # for Action Cable in production
gem 'bootsnap', '>= 1.1.0', require: false # reduces boot time

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw] # debugger console
  gem 'rspec-rails', '~> 3.8' # RSpec testing framework
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring' # speeds up development
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'rubocop', require: false
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
