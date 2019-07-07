# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserSerializer do
  let(:user) { create(:user, name: 'John Doe') }
  let(:serializer) { UserSerializer.new(user) }
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it { is_expected.to include(id: "#{user.id}") }
    it { is_expected.to include(type: :user) }

    describe '> attributes' do
      subject { data[:attributes] }

      it { is_expected.to include(name: 'John Doe') }
    end
  end
end
