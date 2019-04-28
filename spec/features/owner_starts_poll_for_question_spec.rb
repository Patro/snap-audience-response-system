# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Owner starts poll for question', type: :feature do
  set_current_user

  context 'when start poll button is clicked' do
    scenario 'they see a stop poll button' do
      interactive_session = create(:interactive_session, owner: current_user)
      question = create(:single_choice_question,
                        interactive_session: interactive_session,
                        text: 'What is the answer of everything?')
      create_list(:question_option, 2, question: question)

      visit("/interactive_sessions/#{interactive_session.id}/owner")

      find('.start_poll_button').click()

      expect(page).to have_css('.close_poll_button')
    end
  end
end
