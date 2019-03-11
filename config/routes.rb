# frozen_string_literal: true

Rails.application.routes.draw do
  resources :attendances, except: [:update]
  resources :interactive_sessions do
    resources :attendances, only: [:index]
  end
end
