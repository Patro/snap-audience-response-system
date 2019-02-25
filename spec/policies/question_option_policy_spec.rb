# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionOptionPolicy do
  let(:question_option) { create(:question_option) }
  let(:owner) { question_option.question.interactive_session.owner }
  let(:attendee) do
    create(:attendee,
           :with_attendance,
           interactive_session: question_option.question.interactive_session)
  end
  subject { QuestionOptionPolicy.new(user, question_option) }

  describe 'Scope' do
    let(:scope) { QuestionOptionPolicy::Scope.new(user, QuestionOption) }
    subject { scope.resolve }

    context 'as owner' do
      let(:user) { owner }

      context 'given question option without poll' do
        it 'should include question option' do
          is_expected.to include(question_option)
        end
      end

      context 'given question option with poll' do
        before { create(:poll, question: question_option.question) }

        it 'should include question option' do
          is_expected.to include(question_option)
        end
      end
    end

    context 'as attendee' do
      let(:user) { attendee }

      context 'given question option without poll' do
        it 'should not include question option' do
          is_expected.not_to include(question_option)
        end
      end

      context 'given question option with poll' do
        before { create(:poll, question: question_option.question) }

        it 'should include question option' do
          is_expected.to include(question_option)
        end
      end
    end

    context 'as virgin user' do
      let(:user) { create(:user) }

      it 'should not include question option' do
        is_expected.not_to include(question_option)
      end
    end
  end

  context 'as owner' do
    let(:user) { owner }

    it { is_expected.to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.to permit(:update) }
    it { is_expected.to permit(:destroy) }

    context 'given question option without poll' do
      it { is_expected.to permit(:show) }
    end

    context 'given question option with poll' do
      before { create(:poll, question: question_option.question) }

      it { is_expected.to permit(:show) }
    end
  end

  context 'as attendee' do
    let(:user) { attendee }

    it { is_expected.to permit(:index) }
    it { is_expected.not_to permit(:create) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }

    context 'given question option without poll' do
      it { is_expected.not_to permit(:show) }
    end

    context 'given question option with poll' do
      before { create(:poll, question: question_option.question) }

      it { is_expected.to permit(:show) }
    end
  end

  context 'as virgin user' do
    let(:user) { create(:user) }

    it { is_expected.to permit(:index) }
    it { is_expected.not_to permit(:create) }
    it { is_expected.not_to permit(:show) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }
  end
end
