# frozen_string_literal: true

require 'rails_helper'

RSpec.describe QuestionSerializer do
  let(:interactive_session) { create(:interactive_session) }
  let(:question) do
    create(:dummy_question, interactive_session: interactive_session,
                            text: 'What is the answer of everything?')
  end
  let(:serializer) do
    QuestionSerializer.new(question, params: { current_user: create(:user) })
  end
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it { is_expected.to include(id: "#{question.id}") }
    it { is_expected.to include(type: :question) }

    describe '> attributes' do
      subject { data[:attributes] }

      it { is_expected.to include(text: 'What is the answer of everything?') }
    end

    describe '> relationships' do
      describe '> interactive session' do
        subject { data[:relationships][:interactive_session][:data] }

        it { is_expected.to include_identifier_of(interactive_session) }
      end

      describe '> options' do
        subject { data[:relationships][:options][:data] }

        context 'given question without options' do
          it { is_expected.to be_empty }
        end

        context 'given question with option' do
          let!(:question_option) do
            create(:question_option, question: question)
          end

          context 'given policy scope that permits access' do
            before(:each) do
              allow_any_instance_of(QuestionOptionPolicy::Scope)
              .to receive(:resolve)
              .and_return(QuestionOption.all)
            end

            it { is_expected.to include_identifier_of(question_option) }
          end

          context 'given policy scope that denies access' do
            before(:each) do
              allow_any_instance_of(QuestionOptionPolicy::Scope)
              .to receive(:resolve)
              .and_return(QuestionOption.none)
            end

            it { is_expected.not_to include_identifier_of(question_option) }
          end
        end
      end
    end
  end
end
