# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { create(:user) }

  describe '#attendances' do
    subject { user.attendances }

    context 'given user with two attendances' do
      before(:each) do
        @attendances = create_list(:attendance, 2, attendee: user)
      end

      it 'should return attendances' do
        is_expected.to match_array(@attendances)
      end
    end
  end

  describe '#attended_interactive_sessions' do
    subject { user.attended_interactive_sessions }

    context 'given user with two attendances' do
      before(:each) do
        attendances = create_list(:attendance, 2, attendee: user)
        @interactive_sessions = attendances.map(&:interactive_session)
      end

      it 'should return attended interactive sessions' do
        is_expected.to match_array(@interactive_sessions)
      end
    end
  end

  describe '#destroy' do
    context 'given user with owned interactive sessions' do
      before(:each) { create_list(:interactive_session, 5, owner: user) }

      it 'should destroy owned interactive sessions' do
        expect { user.destroy }.to change { InteractiveSession.count }.from(5).to(0)
      end
    end

    context 'given user with attendances' do
      before(:each) { create_list(:attendance, 2, attendee: user) }

      it 'should destroy attendances' do
        expect { user.destroy }.to change { Attendance.count }.from(2).to(0)
      end
    end

    context 'given user with two responses' do
      before(:each) { create_list(:response, 2, respondent: user) }

      it 'should destroy responses' do
        expect { user.destroy }.to change { Response.count }.from(2).to(0)
      end
    end
  end

  describe '#interactive_sessions' do
    subject { user.interactive_sessions }

    context 'given user with two attendances' do
      before(:each) do
        attendances = create_list(:attendance, 2, attendee: user)
        @interactive_sessions = attendances.map(&:interactive_session)
      end

      it 'should return attended interactive sessions' do
        is_expected.to match_array(@interactive_sessions)
      end
    end

    context 'given user with owned interactive sessions' do
      before(:each) do
        @interactive_sessions = create_list(:interactive_session, 5, owner: user)
      end

      it 'should return owned interactive sessions' do
        is_expected.to match_array(@interactive_sessions)
      end
    end

    context 'given user with attendance for owned interactive session' do
      before(:each) do
        @interactive_session = create(:interactive_session, owner: user)
        create(:attendance, interactive_session: @interactive_session,
                            attendee: user)
      end

      it 'should return interactive session' do
        is_expected.to match_array([@interactive_session])
      end
    end

    context 'given user and unassociated interactive session' do
      before(:each) do
        @interactive_session = create(:interactive_session)
      end

      it 'should not return unassociated interactive session' do
        is_expected.to match_array([])
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
        is_expected.to match_array(@interactive_sessions)
      end
    end
  end

  describe '#responses' do
    subject { user.responses }

    context 'given user with two responses' do
      before(:each) do
        @responses = create_list(:response, 2, respondent: user)
      end

      it 'should return responses' do
        is_expected.to match_array(@responses)
      end
    end
  end
end
