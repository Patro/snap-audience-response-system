# frozen_string_literal: true

Rails.application.routes.draw do
  resources :attendances, except: [:update]
  resources :interactive_sessions do
    resources :attendances, only: [:index]
    resources :questions, only: [:index, :create]
  end
  resources :question_options
  resources :questions do
    resources :question_options, only: [:index, :create]
  end
end
