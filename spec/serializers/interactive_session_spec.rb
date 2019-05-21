# frozen_string_literal: true

require 'rails_helper'

RSpec.describe InteractiveSessionSerializer do
  let(:interactive_session) { create(:interactive_session) }
  let(:user) { create(:user) }
  let(:params) { { current_user: user } }
  let(:serializer) { InteractiveSessionSerializer.new(interactive_session, params: params) }
  let(:data) { serializer.serializable_hash[:data] }

  describe 'data' do
    subject { data }

    it { is_expected.to include(id: interactive_session.id.to_s) }
    it { is_expected.to include(type: :interactive_session) }

    describe '> attributes' do
      subject { data[:attributes] }

      context 'given interactive session with label' do
        let(:interactive_session) { create(:interactive_session, label: 'ABC') }

        it { is_expected.to include(label: 'ABC') }
      end

      context 'given interactive session with attendance code' do
        let(:interactive_session) { create(:interactive_session, attendance_code: 'abcd') }

        context 'given policy with show attendance code set to true' do
          before(:each) do
            allow_any_instance_of(InteractiveSessionPolicy)
            .to receive(:show_attendance_code?)
            .and_return(true)
          end

          it { is_expected.to include(attendance_code: 'abcd') }
        end

        context 'given policy with show attendance code set to false' do
          before(:each) do
            allow_any_instance_of(InteractiveSessionPolicy)
            .to receive(:show_attendance_code?)
            .and_return(false)
          end

          it { is_expected.not_to include(attendance_code: 'abcd') }
        end
      end

      context 'given interactive session with current user as owner' do
        let(:interactive_session) { create(:interactive_session, owner: user) }

        it { is_expected.to include(role: :owner) }
      end

      context 'given interactive session with current user as attendee' do
        let(:interactive_session) { create(:interactive_session) }

        before(:each) do
          create(:attendance, attendee: user,
                              interactive_session: interactive_session)
        end

        it { is_expected.to include(role: :attendee) }
      end

      context 'given interactive session with current user as unrelated user' do
        let(:interactive_session) { create(:interactive_session) }

        it { is_expected.to include(role: :none) }
      end
    end

    describe '> relationships' do
      describe '> questions' do
        subject { data[:relationships][:questions][:data] }

        context 'given interactive session without questions' do
          it { is_expected.to be_empty }
        end

        context 'given interactive session with question' do
          let!(:question) do
            create(
              :single_choice_question,
              interactive_session: interactive_session
            )
          end

          context 'given policy scope that permits access' do
            before(:each) do
              allow_any_instance_of(QuestionPolicy::Scope)
              .to receive(:resolve)
              .and_return(Question.all)
            end

            it { is_expected.to include_identifier_of(question) }
          end

          context 'given policy scope that denies access' do
            before(:each) do
              allow_any_instance_of(QuestionPolicy::Scope)
              .to receive(:resolve)
              .and_return(Question.none)
            end

            it { is_expected.not_to include_identifier_of(question) }
          end
        end
      end
    end
  end
end
