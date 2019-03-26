# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Attendee waits for next poll', type: :feature do
  set_current_user

  context 'when new poll is opened' do
    scenario 'they see the questions text' do
      interactive_session = create(:interactive_session)
      create(:attendance, interactive_session: interactive_session,
                          attendee: current_user)

      visit("/interactive_sessions/#{interactive_session.id}")

      expect(page).to have_text('Waiting') # wait until page is loaded

      question = create(
        :single_choice_question,
        interactive_session: interactive_session,
        text: 'What is 4 + 6?'
      )
      create(:poll, :open, question: question)

      expect(page).to have_text('What is 4 + 6?')
    end
  end
end
