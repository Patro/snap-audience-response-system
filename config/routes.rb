# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'static#index'

  mount ActionCable.server => '/cable'

  scope :api do
    resources :attendances, except: [:update]
    resources :interactive_sessions do
      resources :attendances, only: [:index]
      resources :questions, only: [:index, :create]
      resources :polls, only: [:index]
    end
    resources :polls do
      resources :responses, only: [:index, :create]
      resources :question_option_counts, only: [:index]
    end
    resources :question_options
    resources :questions do
      resources :polls, only: [:index, :create]
      resources :question_options, only: [:index, :create]
    end
    resources :responses, except: [:update, :destroy]
    resources :question_option_counts, only: [:index]
  end

  match '*path', constraints: { path: /(?!api\/).*/ }, to: 'static#index', via: :all
end
