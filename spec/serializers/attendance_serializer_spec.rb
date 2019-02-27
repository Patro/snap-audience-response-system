# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AttendanceSerializer do
  let(:interactive_session) { create(:interactive_session) }
  let(:attendance) { create(:attendance, interactive_session: interactive_session) }
  let(:serializer) do
    AttendanceSerializer.new(attendance, params: { current_user: create(:user) })
  end
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it 'should serialize id' do
      is_expected.to include(id: "#{attendance.attendee.id},#{interactive_session.id}")
    end

    it 'should serialize type' do
      is_expected.to include(type: :attendance)
    end

    it 'should not serialize attributes' do
      is_expected.not_to include(:attributes)
    end

    describe 'relationships' do
      describe 'interactive session' do
        subject { data[:relationships][:interactive_session][:data] }

        it 'should serialize id' do
          is_expected.to include(id: interactive_session.id.to_s)
        end

        it 'should serialize type' do
          is_expected.to include(type: :interactive_session)
        end
      end
    end
  end
end
