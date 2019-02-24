# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Attendance, type: :model do
  # behaviour of #eql? differs from default active record implementation
  # because of composite primary key
  describe '#eql?' do
    context 'given an attendance and a clone of it' do
      let(:attendance) { create(:attendance) }
      let(:clone) { attendance.clone }

      it 'should recognize clone as eql' do
        expect(attendance).to eql(clone)
      end
    end
  end

  describe '#valid?' do
    subject { attendance.valid? }

    context 'given attendance with attendee' do
      let(:attendance) { build(:attendance, attendee: create(:attendee)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given attendance without attendee' do
      let(:attendance) { build(:attendance, attendee: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given attendance with interactive session' do
      let(:attendance) do
        create(:attendance, interactive_session: create(:interactive_session))
      end

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given attendance without interactive session' do
      let(:attendance) { build(:attendance, interactive_session: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
