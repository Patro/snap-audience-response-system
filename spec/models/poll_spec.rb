# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Poll, type: :model do
  describe '::responded_by' do
    let(:user) { create(:user) }
    subject { Poll.responded_by(user) }

    context 'given poll with no responses' do
      let(:poll) { create(:poll) }

      it 'should return empty relation' do
        is_expected.to be_empty
      end
    end

    context 'given poll with responses of other user' do
      let(:poll) { create(:poll, :with_responses) }

      it 'should return empty relation' do
        is_expected.to be_empty
      end
    end

    context 'given poll with responses of user' do
      let(:poll) { create(:poll, :with_responses, respondent: user) }

      it 'should return poll' do
        is_expected.to contain_exactly(poll)
      end
    end
  end

  describe '::not_responded_by' do
    let(:user) { create(:user) }
    subject { Poll.not_responded_by(user) }

    context 'given poll with no responses' do
      let(:poll) { create(:poll) }

      it 'should return poll' do
        is_expected.to contain_exactly(poll)
      end
    end

    context 'given poll with responses of other user' do
      let(:poll) { create(:poll, :with_responses) }

      it 'should return poll' do
        is_expected.to contain_exactly(poll)
      end
    end

    context 'given poll with responses of user' do
      let(:poll) { create(:poll, :with_responses, respondent: user) }

      it 'should return empty relation' do
        is_expected.to be_empty
      end
    end
  end

  describe '#destroy' do
    subject { -> { poll.destroy } }

    context 'given poll with two responses' do
      let!(:poll) { create(:poll, :with_responses, responses_count: 2) }

      it 'should destroy responses' do
        is_expected.to change { Response.count }.from(2).to(0)
      end
    end
  end

  describe '#number_of_respondents' do
    subject { poll.number_of_respondents }

    context 'given poll with two responses' do
      let!(:poll) { create(:poll, :with_responses, responses_count: 2) }

      it 'should return 2' do
        is_expected.to eq(2)
      end
    end

    context 'given poll with two responses of the same respondent' do
      let(:question) { create(:multiple_choice_question) }
      let(:respondent) { create(:respondent) }
      let!(:poll) do
        create(:poll, :with_responses,
               responses_count: 2, respondent: respondent)
      end

      it 'should return 1' do
        is_expected.to eq(1)
      end
    end

    context 'given poll with no responses' do
      let(:poll) { create(:poll) }

      it 'should return 0' do
        is_expected.to eq(0)
      end
    end
  end

  describe '#responded_by?' do
    let(:user) { create(:user) }
    subject { poll.responded_by?(user) }

    context 'given poll with no responses' do
      let(:poll) { create(:poll) }

      it 'should return false' do
        is_expected.to be false
      end
    end

    context 'given poll with responses of other user' do
      let(:poll) { create(:poll, :with_responses) }

      it 'should return false' do
        is_expected.to be false
      end
    end

    context 'given poll with response of user' do
      let(:poll) { create(:poll, :with_responses, respondent: user) }

      it 'should return true' do
        is_expected.to be true
      end
    end
  end

  describe '#responses' do
    subject { poll.responses }

    context 'given poll with two responses' do
      let(:poll) { create(:poll) }
      let(:option) { create(:question_option, question: poll.question) }

      before(:each) do
        @responses = create_list(:response, 2,
                                 picked_question_option: option, poll: poll)
      end

      it 'should return responses' do
        is_expected.to match_array(@responses)
      end
    end
  end

  describe '#status' do
    let(:user) { create(:user) }
    subject { poll.status }

    context 'given open poll' do
      let(:poll) { create(:poll, :open) }

      it 'should return open' do
        is_expected.to be(:open)
      end
    end

    context 'given closed poll' do
      let(:poll) { create(:poll, :closed) }

      it 'should return closed' do
        is_expected.to be(:closed)
      end
    end
  end

  describe '#valid?' do
    subject { poll.valid? }

    context 'given poll with question' do
      let(:poll) { build(:poll, question: create(:dummy_question)) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given poll without question' do
      let(:poll) { build(:poll, question: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end

    context 'given poll with closed set to false' do
      let(:poll) { build(:poll, closed: false) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given poll with closed set to true' do
      let(:poll) { build(:poll, closed: true) }

      it 'should be valid' do
        is_expected.to be true
      end
    end

    context 'given poll with closed set to nil' do
      let(:poll) { build(:poll, closed: nil) }

      it 'should not be valid' do
        is_expected.to be false
      end
    end
  end
end
