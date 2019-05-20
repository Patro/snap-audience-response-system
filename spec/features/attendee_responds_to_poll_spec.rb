# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Attendee responds to poll', type: :feature do
  set_current_user

  context 'when one option was selected' do
    scenario 'they see a waiting message' do
      interactive_session = create(:interactive_session)
      create(:attendance, interactive_session: interactive_session,
                          attendee: current_user)
      question = create(
        :single_choice_question,
        interactive_session: interactive_session,
      )
      create(:question_option, question: question, text: '42')
      create(:poll, :open, question: question)

      visit("/interactive_sessions/#{interactive_session.id}")

      within('.respond_form') do
        find('.ant-radio-input', visible: :all).choose()
        click_button('Send')
      end

      expect(page).to have_text('Waiting')
    end
  end
end
