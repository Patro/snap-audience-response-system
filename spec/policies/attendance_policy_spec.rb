# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AttendancePolicy do
  let(:attendance) { create(:attendance) }
  let(:owner) { attendance.interactive_session.owner }
  let(:attendee) { attendance.attendee }
  subject { AttendancePolicy.new(user, attendance) }

  describe 'Scope' do
    let(:scope) { AttendancePolicy::Scope.new(user, Attendance) }
    subject { scope.resolve }

    context 'as owner' do
      let(:user) { owner }

      it 'should include attendance of owned interactive session' do
        is_expected.to include(attendance)
      end

      context 'given attendance of unassociated interactive session' do
        let!(:other) { create(:attendance) }

        it 'should not include attendance' do
          is_expected.not_to include(other)
        end
      end
    end

    context 'as attendee' do
      let(:user) { attendee }

      it 'should include own attendance' do
        is_expected.to include(attendance)
      end

      context 'given unassociated attendance' do
        let!(:other) { create(:attendance) }

        it 'should not include attendance' do
          is_expected.not_to include(other)
        end
      end
    end

    context 'as virgin user' do
      let(:user) { create(:user) }

      it 'should not include attendance' do
        is_expected.not_to include(attendance)
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
    it { is_expected.to permit(:create) }
    it { is_expected.to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.to permit(:destroy) }
  end

  context 'as virgin user' do
    let(:user) { create(:user) }

    it { is_expected.to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end
end
