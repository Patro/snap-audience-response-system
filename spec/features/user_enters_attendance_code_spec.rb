# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'User enters attendance code', type: :feature do
  context 'when attendance code matches sessions code' do
    scenario 'they see the event name' do
      create(
        :interactive_session,
        label: 'Super Event',
        attendance_code: 'ABCD'
      )

      visit root_path

      fill_in('Attendance Code', with: 'ABCD')
      click_button('Join')

      expect(page).to have_text 'Super Event'
    end
  end
end
