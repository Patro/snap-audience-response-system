# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Owner creates new question', type: :feature do
  set_current_user

  context 'when form is submitted' do
    scenario 'they see a list of questions that includes added question' do
      interactive_session = create(:interactive_session, owner: current_user)

      visit("/interactive_sessions/#{interactive_session.id}/owner")

      click_button('Add question')

      within('.question_form') do
        fill_in('Question', with: 'What is 4 + 2?')
        find('label', text: 'Single Choice').click()

        options = all('.question_form__option')
        within(options.at(0)) do
          fill_in('Text', with: '5')
        end
        within(options.at(1)) do
          fill_in('Text', with: '6')
          find('.question_form__option_correct_flag').click()
        end
        within(options.at(2)) do
          fill_in('Text', with: '7')
        end

        click_button('Save')
      end

      expect(page).to have_text('What is 4 + 2?')
    end
  end
end
