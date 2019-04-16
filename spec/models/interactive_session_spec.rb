# frozen_string_literal: true

require 'rails_helper'

RSpec.describe InteractiveSession, type: :model do
  describe '#attendances' do
    subject { interactive_session.attendances }

    context 'given interactive session with two attendances' do
      let(:interactive_session) { create(:interactive_session) }

      before(:each) do
        @attendances = create_list(:attendance, 2,
                                   interactive_session: interactive_session)
      end

      it 'should return attendances' do
        is_expected.to match_array(@attendances)
      end
    end
  end

  describe '#attendees' do
    subject { interactive_session.attendees }

    context 'given interactive session with two attendances' do
      let(:interactive_session) { create(:interactive_session) }

      before(:each) do
        attendances = create_list(:attendance, 2,
                                  interactive_session: interactive_session)
        @attendees = attendances.map(&:attendee)
      end

      it 'should return two attendees' do
        is_expected.to match_array(@attendees)
      end
    end
  end

  describe '#create' do
    subject { create(:interactive_session, attendance_code: 'abcd') }

    context 'given interactive sessions with different attendance code' do
      before(:each) do
        create(:interactive_session, attendance_code: 'abcc')
        create(:interactive_session, attendance_code: 'abce')
      end

      it 'should be possible to create interactive session' do
        is_expected.to be_truthy
      end
    end

    context 'given interactive session with identical attendance code' do
      before(:each) do
        create(:interactive_session, attendance_code: 'abcd')
      end

      it 'should not be possible to create interactive session' do
        expect { subject }.to raise_error(ActiveRecord::RecordNotUnique)
      end
    end
  end

  describe '#destroy' do
    subject { -> { interactive_session.destroy } }

    context 'given interactive session with attendances' do
      let(:interactive_session) { create(:interactive_session) }

      before(:each) do
        @attendances = create_list(:attendance, 2,
                                   interactive_session: interactive_session)
      end

      it 'should destroy attendances' do
        is_expected.to change { Attendance.count }.from(2).to(0)
      end
    end

    context 'given interactive session with two questions' do
      let(:interactive_session) { create(:interactive_session) }

      before(:each) do
        create_list(:dummy_question, 2,
                    interactive_session: interactive_session)
      end

      it 'should destroy questions' do
        is_expected.to change { Question.count }.from(2).to(0)
      end
    end
  end

  describe '#polls' do
    subject { interactive_session.polls }

    context 'given interactive session with two polls' do
      let(:interactive_session) { create(:interactive_session) }
      let(:question) do
        create(:dummy_question, interactive_session: interactive_session)
      end

      before(:each) do
        @polls = create_list(:poll, 2, question: question)
      end

      it 'should return polls' do
        is_expected.to match_array(@polls)
      end
    end
  end

  describe '#questions' do
    subject { interactive_session.questions }

    context 'given interactive session with two questions' do
      let(:interactive_session) { create(:interactive_session) }

      before(:each) do
        @questions = create_list(:dummy_question, 2,
                                 interactive_session: interactive_session)
      end

      it 'should return questions' do
        is_expected.to match_array(@questions)
      end
    end
  end

  describe '#valid?' do
    subject { interactive_session.valid? }

    context 'given interactive session with four char long attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: 'abcd') }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given interactive session with three char long attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: 'abc') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given interactive session with five char long attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: 'abcde') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given interactive session with missing attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: nil) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given interactive session with empty attendance code' do
      let(:interactive_session) { build(:interactive_session, attendance_code: '') }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given interactive session with user as owner' do
      let(:interactive_session) { build(:interactive_session, owner: create(:user)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given interactive session with missing owner' do
      let(:interactive_session) { build(:interactive_session, owner: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
