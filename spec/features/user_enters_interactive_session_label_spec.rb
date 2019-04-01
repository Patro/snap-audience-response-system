# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'User enters interactive session label', type: :feature do
  scenario 'they see the label and attendance code' do
    visit(root_path)

    fill_in('Session Name', with: 'My Super Session')
    click_button('Start')

    expect(page).to have_text('My Super Session')

    created_session = InteractiveSession.last
    expect(page).to have_text(created_session.attendance_code)
  end
end
