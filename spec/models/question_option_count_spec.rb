# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionOptionCount, type: :model do
  describe '#id' do
    subject { question_option_count.id }

    context 'given count without poll id' do
      let(:question_option_count) do
        build(:question_option_count, poll_id: nil)
      end

      it 'should return nil' do
        is_expected.to be_nil
      end
    end

    context 'given count without question option id' do
      let(:question_option_count) do
        build(:question_option_count, question_option_id: nil)
      end

      it 'should return nil' do
        is_expected.to be_nil
      end
    end

    context 'given count with poll and question option id' do
      let(:poll) { create(:poll) }
      let(:question_option) { create(:question_option) }
      let(:question_option_count) do
        build(
          :question_option_count,
          poll_id: poll.id,
          question_option_id: question_option.id,
        )
      end

      it 'should return composite id' do
        is_expected.to eq("#{poll.id},#{question_option.id}")
      end
    end
  end

  describe '#eql?' do
    subject { question_option_count }

    context 'given same object' do
      let(:question_option_count) { build(:question_option_count) }
      let(:other) { question_option_count }

      it { is_expected.to eql other }
    end

    context 'given object with same poll id, question option id and number' do
      let(:question_option_count) { build(:question_option_count) }
      let(:other) do
        build(:question_option_count,
              poll_id: question_option_count.poll_id,
              question_option_id: question_option_count.question_option_id,
              number_of_responses: question_option_count.number_of_responses)
      end

      it { is_expected.to eql other }
    end

    context 'given object with different poll id' do
      let(:question_option_count) { build(:question_option_count) }
      let(:other) do
        build(:question_option_count,
              question_option_id: question_option_count.question_option_id,
              number_of_responses: question_option_count.number_of_responses)
      end

      it { is_expected.not_to eql other }
    end

    context 'given object with different question option id' do
      let(:question_option_count) { build(:question_option_count) }
      let(:other) do
        build(:question_option_count,
              poll_id: question_option_count.poll_id,
              number_of_responses: question_option_count.number_of_responses)
      end

      it { is_expected.not_to eql other }
    end

    context 'given object with different number' do
      let(:question_option_count) do
        build(:question_option_count, number_of_responses: 100)
      end
      let(:other) do
        build(:question_option_count,
              poll_id: question_option_count.poll_id,
              question_option_id: question_option_count.question_option_id,
              number_of_responses: 101)
      end

      it { is_expected.not_to eql other }
    end
  end

  describe '#poll' do
    subject { question_option_count.poll }

    context 'given count without poll id' do
      let(:question_option_count) do
        build(:question_option_count, poll_id: nil)
      end

      it 'should return nil' do
        is_expected.to be_nil
      end
    end

    context 'given count with poll id' do
      let(:poll) { create(:poll) }
      let(:question_option_count) do
        build(:question_option_count, poll_id: poll.id)
      end

      it 'should return poll' do
        is_expected.to eq(poll)
      end
    end
  end

  describe '#poll=' do
    context 'given count without poll id' do
      let(:poll) { create(:poll) }
      let(:question_option_count) do
        build(:question_option_count, poll_id: nil)
      end

      it 'should set poll id' do
        expect { question_option_count.poll = poll }
        .to change { question_option_count.poll_id }
        .to(poll.id)
      end
    end
  end

  describe '#question_option' do
    subject { question_option_count.question_option }

    context 'given count without question option id' do
      let(:question_option_count) do
        build(:question_option_count, question_option_id: nil)
      end

      it 'should return nil' do
        is_expected.to be_nil
      end
    end

    context 'given count with question option id' do
      let(:question_option) { create(:question_option) }
      let(:question_option_count) do
        build(:question_option_count, question_option_id: question_option.id)
      end

      it 'should return question option' do
        is_expected.to eq(question_option)
      end
    end
  end

  describe '#question_option=' do
    context 'given count without question option id' do
      let(:question_option) { create(:question_option) }
      let(:question_option_count) do
        build(:question_option_count, question_option_id: nil)
      end

      it 'should set question option id' do
        expect { question_option_count.question_option = question_option }
        .to change { question_option_count.question_option_id }
        .to(question_option.id)
      end
    end
  end
end
