# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionOptionCountPolicy do
  let(:poll) { create(:poll) }
  let(:interactive_session) { poll.question.interactive_session }
  let(:question_option_count) { build(:question_option_count, poll: poll) }
  let(:owner) { interactive_session.owner }
  let(:attendee) do
    create(:attendee,
           :with_attendance,
           interactive_session: interactive_session)
  end
  subject { QuestionOptionCountPolicy.new(user, question_option_count) }

  context 'as owner' do
    let(:user) { owner }

    it { is_expected.not_to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }

    context 'given open poll' do
      let(:poll) { create(:poll, :open) }

      it { is_expected.to permit(:index) }
    end

    context 'given closed poll' do
      let(:poll) { create(:poll, :closed) }

      it { is_expected.to permit(:index) }
    end
  end

  context 'as attendee' do
    let(:user) { attendee }

    it { is_expected.not_to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }

    context 'given open poll' do
      let(:poll) { create(:poll, :open) }

      it { is_expected.not_to permit(:index) }
    end

    context 'given closed poll' do
      let(:poll) { create(:poll, :closed) }

      it { is_expected.to permit(:index) }
    end
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
