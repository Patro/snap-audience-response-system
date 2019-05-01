# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Owner views results of poll', type: :feature do
  set_current_user

  context 'when question is selected' do
    scenario 'they see the results of the latest poll' do
      interactive_session = create(:interactive_session, owner: current_user)
      question = create(:single_choice_question,
                        interactive_session: interactive_session,
                        text: 'What is the answer of everything?')
      question_options = create_list(:question_option, 2, question: question)
      poll = create(:poll, question: question)
      create_list(:response, 2,
                  poll: poll, picked_question_option: question_options.first)
      create_list(:response, 8,
                  poll: poll, picked_question_option: question_options.second)

      visit("/interactive_sessions/#{interactive_session.id}/owner")

      find('.question_list_item').click()

      expect(page).to have_text('20%')
      expect(page).to have_text('80%')
    end
  end
end
