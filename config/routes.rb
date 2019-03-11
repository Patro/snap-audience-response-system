# frozen_string_literal: true

Rails.application.routes.draw do
  resources :attendances, except: [:update]
  resources :interactive_sessions do
    resources :attendances, only: [:index]
    resources :questions, only: [:index, :create]
  end
  resources :polls
  resources :question_options
  resources :questions do
    resources :polls, only: [:index, :create]
    resources :question_options, only: [:index, :create]
  end
end
