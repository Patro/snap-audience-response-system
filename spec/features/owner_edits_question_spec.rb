# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Owner edits question', type: :feature do
  set_current_user

  context 'when form is submitted' do
    scenario 'they see a list of questions that includes updated question' do
      interactive_session = create(:interactive_session, owner: current_user)
      question = create(:single_choice_question,
                        interactive_session: interactive_session,
                        text: 'What is the answer of everything?')
      create_list(:question_option, 2, question: question)

      visit("/interactive_sessions/#{interactive_session.id}/owner")

      find('.question_list__edit_button').click()

      within('.question_form') do
        fill_in('Question', with: 'What is 4 + 2?')

        click_button('Save')
      end

      expect(page).to have_text('What is 4 + 2?')
    end
  end
end
