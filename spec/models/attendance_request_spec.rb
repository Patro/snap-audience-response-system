# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AttendanceRequest, type: :model do
  describe '#valid?' do
    subject { attendance_request.valid? }

    context 'given attendance request with requester' do
      let(:attendance_request) { build(:attendance_request, requester: create(:requester)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given attendance request without requester' do
      let(:attendance_request) { build(:attendance_request, requester: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given attendance request with four char long attendance code' do
      let(:attendance_request) { build(:attendance_request, attendance_code: 'abcd') }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given attendance request with three char long attendance code' do
      let(:attendance_request) { build(:attendance_request, attendance_code: 'abc') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given attendance request with five char long attendance code' do
      let(:attendance_request) { build(:attendance_request, attendance_code: 'abcde') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given attendance request with missing attendance code' do
      let(:attendance_request) { build(:attendance_request, attendance_code: nil) }

      it 'should not be valid' do
        is_expected.not_to be true
      end
    end

    context 'given attendance request with empty attendance code' do
      let(:attendance_request) { build(:attendance_request, attendance_code: '') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
