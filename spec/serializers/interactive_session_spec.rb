# frozen_string_literal: true

require 'rails_helper'

RSpec.describe InteractiveSessionSerializer do
  let(:interactive_session) { create(:interactive_session) }
  let(:params) { { current_user: create(:user) } }
  let(:serializer) { InteractiveSessionSerializer.new(interactive_session, params: params) }
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it 'should serialize id' do
      is_expected.to include(id: interactive_session.id.to_s)
    end

    it 'should serialize type' do
      is_expected.to include(type: :interactive_session)
    end

    describe 'attributes' do
      subject { data[:attributes] }

      context 'given interactive session with label' do
        let(:interactive_session) { create(:interactive_session, label: 'ABC') }

        it 'should serialize label' do
          is_expected.to include(label: 'ABC')
        end
      end

      context 'given interactive session with attendance code' do
        let(:interactive_session) { create(:interactive_session, attendance_code: 'abcd') }

        context 'given policy with show attendance code set to true' do
          it 'should serialize attendance code' do
            allow_any_instance_of(InteractiveSessionPolicy)
            .to receive(:show_attendance_code?)
            .and_return(true)

            is_expected.to include(attendance_code: 'abcd')
          end
        end

        context 'given policy with show attendance code set to false' do
          it 'should not serialize attendance code' do
            allow_any_instance_of(InteractiveSessionPolicy)
            .to receive(:show_attendance_code?)
            .and_return(false)

            is_expected.not_to include(attendance_code: 'abcd')
          end
        end
      end
    end

    describe 'relationships' do
      describe 'questions' do
        subject { data[:relationships][:questions][:data] }

        context 'given interactive session without questions' do
          it 'should serialize empty array' do
            is_expected.to be_empty
          end
        end

        context 'given interactive session with question' do
          let!(:question) do
            create(
              :single_choice_question,
              interactive_session: interactive_session
            )
          end
          let(:question_reference) do
            {
              id: question.id.to_s,
              type: :single_choice_question,
            }
          end

          context 'given policy scope that permits access' do
            it 'should include reference to question' do
              allow_any_instance_of(QuestionPolicy::Scope)
              .to receive(:resolve)
              .and_return(Question.all)

              is_expected.to include(question_reference)
            end
          end

          context 'given policy scope that denies access' do
            it 'should not include reference to question' do
              allow_any_instance_of(QuestionPolicy::Scope)
              .to receive(:resolve)
              .and_return(Question.none)

              is_expected.not_to include(question_reference)
            end
          end
        end
      end
    end
  end
end
