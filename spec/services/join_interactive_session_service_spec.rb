# frozen_string_literal: true

require 'rails_helper'

RSpec.describe JoinInteractiveSessionService do
  let!(:interactive_session) do
    create(:interactive_session, attendance_code: 'ABCD')
  end
  let(:attendance_request) do
    build(:attendance_request, attendance_code: given_attendance_code)
  end
  let(:service) do
    JoinInteractiveSessionService.new(attendance_request)
  end

  context 'given valid attendance code' do
    let(:given_attendance_code) { 'ABCD' }

    subject { service.call }

    it 'should create attendance' do
      expect { service.call }
      .to change { Attendance.count }.from(0).to(1)
    end

    describe 'attendance' do
      it { is_expected.to be_persisted }

      it 'should have association to interactive session' do
        is_expected.to have_attributes(
          interactive_session: interactive_session
        )
      end

      it 'should have association to requester' do
        is_expected.to have_attributes(
          attendee: attendance_request.requester
        )
      end
    end

    context 'given preexisting attendance for interactive session' do
      let!(:given_attendance) do
        create(:attendance, interactive_session: interactive_session,
                            attendee: attendance_request.requester)
      end

      it 'should not create a new attendance' do
        expect { service.call }
        .not_to change { Attendance.count }
      end

      it 'should return preexisting attendance' do
        is_expected.to eql(given_attendance)
      end
    end
  end

  context 'given valid attendance code in lower case' do
    let(:given_attendance_code) { 'abcd' }

    subject { service.call }

    it 'should create attendance' do
      expect { service.call }
      .to change { Attendance.count }.from(0).to(1)
    end
  end

  context 'given non existing attendance code' do
    let(:given_attendance_code) { 'AAAA' }

    it 'should raise unprocessable entitiy error' do
      expect { service.call }.to raise_error(Errors::UnprocessableEntityError)
    end
  end

  context 'given invalid attendance code' do
    let(:given_attendance_code) { 'AAA' }

    it 'should raise validation error' do
      expect { service.call }.to raise_error(ActiveModel::ValidationError)
    end
  end
end
