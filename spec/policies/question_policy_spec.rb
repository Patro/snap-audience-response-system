# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionPolicy do
  let(:question) { create(:dummy_question) }
  let(:owner) { question.interactive_session.owner }
  let(:attendee) do
    create(:attendee,
           :with_attendance,
           interactive_session: question.interactive_session)
  end
  subject { QuestionPolicy.new(user, question) }

  describe 'Scope' do
    let(:scope) { QuestionPolicy::Scope.new(user, Question) }
    subject { scope.resolve }

    context 'as owner' do
      let(:user) { owner }

      context 'given question without poll' do
        it 'should include question' do
          is_expected.to include(question)
        end
      end

      context 'given question with poll' do
        before { create(:poll, question: question) }

        it 'should include question' do
          is_expected.to include(question)
        end
      end
    end

    context 'as attendee' do
      let(:user) { attendee }

      context 'given question without poll' do
        it 'should not include question' do
          is_expected.not_to include(question)
        end
      end

      context 'given question with poll' do
        before { create(:poll, question: question) }

        it 'should include question' do
          is_expected.to include(question)
        end
      end
    end

    context 'as virgin user' do
      let(:user) { create(:user) }

      it 'should not include question' do
        is_expected.not_to include(question)
      end
    end
  end

  context 'as owner' do
    let(:user) { owner }

    it { is_expected.to permit(:index) }
    it { is_expected.to permit(:create) }
    it { is_expected.to permit(:update) }
    it { is_expected.to permit(:destroy) }

    context 'given question without poll' do
      it { is_expected.to permit(:show) }
    end

    context 'given question with poll' do
      before { create(:poll, question: question) }

      it { is_expected.to permit(:show) }
    end
  end

  context 'as attendee' do
    let(:user) { attendee }

    it { is_expected.to permit(:index) }
    it { is_expected.not_to permit(:create) }
    it { is_expected.not_to permit(:update) }
    it { is_expected.not_to permit(:destroy) }

    context 'given question without poll' do
      it { is_expected.not_to permit(:show) }
    end

    context 'given question with poll' do
      before { create(:poll, question: question) }

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
