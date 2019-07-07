# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserPolicy do
  let(:user) { create(:user) }
  let(:owner) { attendance.interactive_session.owner }
  subject { UserPolicy.new(acting_user, user) }

  describe 'Scope' do
    let(:scope) { UserPolicy::Scope.new(acting_user, User) }
    subject { scope.resolve }

    context 'as user itself' do
      let(:acting_user) { user }

      it 'includes user' do
        is_expected.to include(user)
      end

      context 'given unrelated user' do
        let!(:unrelated) { create(:user) }

        it 'does not include unrelated user' do
          is_expected.not_to include(unrelated)
        end
      end
    end

    context 'as owner of session' do
      let(:interactive_session) { create(:interactive_session) }
      let(:acting_user) { interactive_session.owner }

      context 'given attendance of user' do
        before(:each) do
          create(:attendance, attendee: user,
                              interactive_session: interactive_session)
        end

        it 'includes user' do
          is_expected.to include(user)
        end
      end

      context 'without attendance of user' do
        it 'does not include user' do
          is_expected.not_to include(user)
        end
      end
    end

    context 'as attendee of session' do
      let(:interactive_session) { create(:interactive_session) }
      let(:acting_user) do
        create(:attendance, interactive_session: interactive_session).attendee
      end

      context 'given attendance of user' do
        before(:each) do
          create(:attendance, attendee: user,
                              interactive_session: interactive_session)
        end

        it 'does not include user' do
          is_expected.not_to include(user)
        end
      end
    end
  end

  context 'as user itself' do
    let(:acting_user) { user }

    it { is_expected.to permit(:index) }
    it { is_expected.not_to permit(:create) }
    it { is_expected.to permit(:show) }
    it { is_expected.to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end

  context 'as owner of session' do
    let(:interactive_session) { create(:interactive_session) }
    let(:acting_user) { interactive_session.owner }

    context 'given attendance of user' do
      before(:each) do
        create(:attendance, attendee: user,
                            interactive_session: interactive_session)
      end

      it { is_expected.to permit(:index) }
      it { is_expected.not_to permit(:create) }
      it { is_expected.to permit(:show) }
      it { is_expected.not_to permit(:update) }
      it { is_expected.not_to permit(:destroy) }
    end

    context 'without attendance of user' do
      it { is_expected.to permit(:index) }
      it { is_expected.not_to permit(:create) }
      it { is_expected.not_to permit(:show) }
      it { is_expected.not_to permit(:update) }
      it { is_expected.not_to permit(:destroy) }
    end
  end

  context 'as attendee of session' do
    let(:interactive_session) { create(:interactive_session) }
    let(:acting_user) do
      create(:attendance, interactive_session: interactive_session).attendee
    end

    context 'given attendance of user' do
      before(:each) do
        create(:attendance, attendee: user,
                            interactive_session: interactive_session)
      end

      it { is_expected.to permit(:index) }
      it { is_expected.not_to permit(:create) }
      it { is_expected.not_to permit(:show) }
      it { is_expected.not_to permit(:update) }
      it { is_expected.not_to permit(:destroy) }
    end
  end
end
