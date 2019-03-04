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

    it 'should serialize id' do
      is_expected.to include(id: "#{question.id}")
    end

    it 'should serialize type' do
      is_expected.to include(type: :question)
    end

    describe 'attributes' do
      subject { data[:attributes] }

      it 'should serialize text' do
        is_expected.to include(text: 'What is the answer of everything?')
      end
    end

    describe 'relationships' do
      describe 'interactive session' do
        subject { data[:relationships][:interactive_session][:data] }

        it 'should serialize id' do
          is_expected.to include(id: interactive_session.id.to_s)
        end

        it 'should serialize type' do
          is_expected.to include(type: :interactive_session)
        end
      end

      describe 'options' do
        subject { data[:relationships][:options][:data] }

        context 'given question without options' do
          it 'should serialize empty array' do
            is_expected.to be_empty
          end
        end

        context 'given question with option' do
          let!(:question_option) do
            create(:question_option, question: question)
          end
          let(:question_option_reference) do
            {
              id: question_option.id.to_s,
              type: :question_option,
            }
          end

          context 'given policy scope that permits access' do
            it 'should include reference to question option' do
              allow_any_instance_of(QuestionOptionPolicy::Scope)
              .to receive(:resolve)
              .and_return(QuestionOption.all)

              is_expected.to include(question_option_reference)
            end
          end

          context 'given policy scope that denies access' do
            it 'should not include reference to question option' do
              allow_any_instance_of(QuestionOptionPolicy::Scope)
              .to receive(:resolve)
              .and_return(QuestionOption.none)

              is_expected.not_to include(question_option_reference)
            end
          end
        end
      end
    end
  end
end
