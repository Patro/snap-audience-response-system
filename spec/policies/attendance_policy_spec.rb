# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AttendancePolicy do
  let(:attendance) { create(:attendance) }
  subject { AttendancePolicy.new(user, attendance) }

  context 'as virgin user' do
    let(:user) { create(:user) }

    it { is_expected.not_to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end
end
