# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { create(:user) }

  describe '#destroy' do
    context 'given user with owned interactive sessions' do
      before(:each) { create_list(:interactive_session, 5, owner: user) }

      it 'should destroy owned interactive sessions' do
        expect { user.destroy }.to change { InteractiveSession.count }.from(5).to(0)
      end
    end
  end

  describe '#owned_interactive_sessions' do
    subject { user.owned_interactive_sessions }

    context 'given user with owned interactive sessions' do
      before(:each) do
        @interactive_sessions = create_list(:interactive_session, 5, owner: user)
      end

      it 'should return owned interactive sessions' do
        is_expected.to match(@interactive_sessions)
      end
    end
  end
end
