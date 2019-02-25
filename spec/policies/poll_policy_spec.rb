# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PollPolicy do
  let(:poll) { create(:poll) }
  let(:owner) { poll.question.interactive_session.owner }
  let(:attendee) do
    create(:attendee,
           :with_attendance,
           interactive_session: poll.question.interactive_session)
  end
  subject { PollPolicy.new(user, poll) }

  describe 'Scope' do
    let(:scope) { PollPolicy::Scope.new(user, Poll) }
    subject { scope.resolve }

    context 'as owner' do
      let(:user) { owner }

      context 'given poll of owned interactive session' do
        it 'should include poll' do
          is_expected.to include(poll)
        end
      end

      context 'given poll of unassociated interactive session' do
        let!(:other_poll) { create(:poll) }

        it 'should not include poll' do
          is_expected.not_to include(other_poll)
        end
      end
    end

    context 'as attendee' do
      let(:user) { attendee }

      context 'given poll of attended interactive session' do
        it 'should include poll' do
          is_expected.to include(poll)
        end
      end

      context 'given poll of unassociated interactive session' do
        let!(:other_poll) { create(:poll) }

        it 'should not include poll' do
          is_expected.not_to include(other_poll)
        end
      end
    end

    context 'as virgin user' do
      let(:user) { create(:user) }

      context 'given poll of interactive session' do
        it 'should not include poll' do
          is_expected.not_to include(poll)
        end
      end
    end
  end

  context 'as owner' do
    let(:user) { owner }

    it { is_expected.to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.to permit(:destroy) }
  end

  context 'as attendee' do
    let(:user) { attendee }

    it { is_expected.to permit(:index) }
    it { is_expected.not_to permit(:create) }
    it { is_expected.to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end

  context 'as virgin user' do
    let(:user) { create(:user) }

    it { is_expected.to permit(:index) }
    it { is_expected.not_to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end
end
