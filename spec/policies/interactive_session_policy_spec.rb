# frozen_string_literal: true

require 'rails_helper'

RSpec.describe InteractiveSessionPolicy do
  let(:interactive_session) { create(:interactive_session) }
  let(:owner) { interactive_session.owner }
  let(:attendee) do
    create(:attendee,
           :with_attendance,
           interactive_session: interactive_session)
  end
  subject { InteractiveSessionPolicy.new(user, interactive_session) }

  describe 'Scope' do
    let(:scope) { InteractiveSessionPolicy::Scope.new(user, InteractiveSession) }
    subject { scope.resolve }

    context 'as owner' do
      let(:user) { owner }

      it 'should include owned interactive session' do
        is_expected.to include(interactive_session)
      end

      context 'given unassociated interactive session' do
        before { @unassociated = create(:interactive_session) }

        it 'should not include unassociated interactive session' do
          is_expected.not_to include(@unassociated)
        end
      end
    end

    context 'as attendee' do
      let(:user) { attendee }

      it 'should include attended interactive session' do
        is_expected.to include(interactive_session)
      end

      context 'given unassociated interactive session' do
        before { @unassociated = create(:interactive_session) }

        it 'should not include unassociated interactive session' do
          is_expected.not_to include(@unassociated)
        end
      end
    end

    context 'as virgin user' do
      let(:user) { create(:user) }

      it 'should not include interactive session' do
        is_expected.not_to include(interactive_session)
      end
    end
  end

  context 'as owner' do
    let(:user) { owner }

    it { is_expected.to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.to permit(:show) }
    it { is_expected.to permit(:show_attendance_code) }
    it { is_expected.to permit(:update) }
    it { is_expected.to permit(:destroy) }
  end

  context 'as attendee' do
    let(:user) { attendee }

    it { is_expected.to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.to permit(:show) }
    it { is_expected.not_to permit(:show_attendance_code) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end

  context 'as virgin user' do
    let(:user) { create(:user) }

    it { is_expected.to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:show_attendance_code) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end
end
