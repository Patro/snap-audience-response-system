# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationCable::Connection, type: :channel do
  describe 'authorization' do
    context 'given cookie with existing user id' do
      let(:user) { create(:user) }

      before(:each) do
        cookies.encrypted[:ars_user_session] = { 'user_id' => user.id.to_s }
      end

      it 'does not reject connection' do
        expect { connect '/cable' }.not_to have_rejected_connection
      end
    end

    context 'given cookie with non existing user id' do
      before(:each) do
        cookies.encrypted[:ars_user_session] = { 'user_id' => '100' }
      end

      it 'does reject connection' do
        expect { connect '/cable' }.to have_rejected_connection
      end
    end
  end

  describe '#current_user' do
    subject { connection.current_user }

    context 'given cookie with user id' do
      let(:user) { create(:user) }

      before(:each) do
        cookies.encrypted[:ars_user_session] = { 'user_id' => user.id.to_s }
        connect '/cable'
      end

      it { is_expected.to eq user }
    end
  end

  describe '#connection_identifier' do
    subject { connection.connection_identifier }

    context 'given cookie with user id' do
      let(:user) { create(:user) }

      before(:each) do
        cookies.encrypted[:ars_user_session] = { 'user_id' => user.id.to_s }
        connect '/cable'
      end

      it { is_expected.to eq user.id.to_s }
    end
  end
end
