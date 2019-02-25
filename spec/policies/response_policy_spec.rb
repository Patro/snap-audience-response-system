# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ResponsePolicy do
  let(:response) { create(:response) }
  let(:owner) { response.poll.question.interactive_session.owner }
  let(:attendee) do
    create(:attendee,
           :with_attendance,
           interactive_session: response.poll.question.interactive_session)
  end
  subject { ResponsePolicy.new(user, response) }

  context 'as owner' do
    let(:user) { owner }

    it { is_expected.not_to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end

  context 'as attendee' do
    let(:user) { attendee }

    it { is_expected.not_to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end

  context 'as virgin user' do
    let(:user) { create(:user) }

    it { is_expected.not_to permit(:index) }
    it { is_expected.not_to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end
end
