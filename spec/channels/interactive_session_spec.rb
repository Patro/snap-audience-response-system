# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationCable::InteractiveSessionChannel, type: :channel do
  let(:user) { create(:user) }

  before do
    stub_connection current_user: user
  end

  describe 'subscription' do
    subject { subscription }

    context 'when id of existing interactive session is given' do
      let(:interactive_session) { create(:interactive_session) }

      context 'given policy that permits show action' do
        permit_action(InteractiveSession, :show?)

        before { subscribe(id: interactive_session.id) }

        it { is_expected.to be_confirmed }
      end

      context 'given policy that denies show action' do
        deny_action(InteractiveSession, :show?)

        before { subscribe(id: interactive_session.id) }

        it { is_expected.to be_rejected }
      end
    end

    context 'when id of non existing interactive session is given' do
      before { subscribe(id: 100) }

      it { is_expected.to be_rejected }
    end

    context 'when id is missing' do
      before { subscribe(id: nil) }

      it { is_expected.to be_rejected }
    end
  end
end
