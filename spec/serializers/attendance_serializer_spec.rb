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

    it { is_expected.to include(id: attendance.id.join(',')) }
    it { is_expected.to include(type: :attendance) }
    it { is_expected.not_to include(:attributes) }

    describe '> relationships' do
      describe '> interactive session' do
        subject { data[:relationships][:interactive_session][:data] }

        it { is_expected.to include_identifier_of(interactive_session) }
      end
    end
  end
end
