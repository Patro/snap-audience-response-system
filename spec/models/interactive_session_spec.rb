# frozen_string_literal: true

require 'rails_helper'

RSpec.describe InteractiveSession, type: :model do
  describe '#create' do
    subject { create(:interactive_session, attendance_code: 'abcd') }

    context 'given interactive sessions with different attendance code' do
      before(:each) do
        create(:interactive_session, attendance_code: 'abcc')
        create(:interactive_session, attendance_code: 'abce')
      end

      it 'should be possible to create interactive session' do
        is_expected.to be_truthy
      end
    end

    context 'given interactive session with identical attendance code' do
      before(:each) do
        create(:interactive_session, attendance_code: 'abcd')
      end

      it 'should not be possible to create interactive session' do
        expect { subject }.to raise_error(ActiveRecord::RecordNotUnique)
      end
    end
  end

  describe '#valid?' do
    subject { interactive_session.valid? }

    context 'given interactive session with four char long attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: 'abcd') }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given interactive session with three char long attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: 'abc') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given interactive session with five char long attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: 'abcde') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given interactive session with missing attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: nil) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given interactive session with empty attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: '') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given interactive session with user as owner' do
      let(:interactive_session) { build(:interactive_session, owner: create(:user)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given interactive session with missing owner' do
      let(:interactive_session) { build(:interactive_session, owner: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
