# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Owner deletes question', type: :feature do
  set_current_user

  context 'when button is clicked' do
    scenario 'they see a list of questions without the deleted question' do
      interactive_session = create(:interactive_session, owner: current_user)
      question = create(:single_choice_question,
                        interactive_session: interactive_session,
                        text: 'What is 4 + 2?')
      create_list(:question_option, 2, question: question)

      visit("/interactive_sessions/#{interactive_session.id}/owner")

      expect(page).to have_text('What is 4 + 2?')

      find('.question_list__delete_button').click()
      click_button('Yes')

      expect(page).not_to have_text('What is 4 + 2?')
    end
  end
end
