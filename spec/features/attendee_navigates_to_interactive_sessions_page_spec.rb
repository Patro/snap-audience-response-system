# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Attendee navigates to interactive sessions page', type: :feature do
  set_current_user

  context 'without open poll' do
    scenario 'they see a waiting message' do
      interactive_session = create(:interactive_session)
      create(:attendance, interactive_session: interactive_session,
                          attendee: current_user)

      visit("/interactive_sessions/#{interactive_session.id}")

      expect(page).to have_text('Waiting')
    end
  end

  context 'given open poll' do
    scenario 'they see the questions text' do
      interactive_session = create(:interactive_session)
      create(:attendance, interactive_session: interactive_session,
                          attendee: current_user)
      question = create(
        :single_choice_question,
        interactive_session: interactive_session,
        text: 'What is 4 + 6?'
      )
      create(:poll, :open, question: question)

      visit("/interactive_sessions/#{interactive_session.id}")

      expect(page).to have_text('What is 4 + 6?')
    end
  end
end
