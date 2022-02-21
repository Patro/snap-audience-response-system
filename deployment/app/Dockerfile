FROM node:11.4-alpine AS frontend_build

WORKDIR /app
COPY . /app
RUN yarn build

FROM ruby:2.6.1

WORKDIR /app

COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install --jobs 5 --retry 5 --without development test

COPY . /app
COPY --from=frontend_build /app/frontend/build /app/frontend/build

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
