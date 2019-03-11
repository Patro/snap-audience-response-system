# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CreateInteractiveSessionService do
  let(:interactive_session) { InteractiveSession.new(params) }
  let(:service) { CreateInteractiveSessionService.new(interactive_session) }

  context 'given valid interactive session' do
    let(:owner) { create(:owner) }
    let(:params) { { label: 'My Session', owner: owner } }

    subject { service.call }

    it 'should create interactive session' do
      expect { service.call }
      .to change { InteractiveSession.count }.from(0).to(1)
    end

    describe 'interactive session' do
      it { is_expected.to be_persisted }

      it 'should have attendance code with four uppercase letters' do
        is_expected.to have_attributes(
          attendance_code: a_string_matching(/\A[A-Z]{4}\z/)
        )
      end
    end

    context 'given sub of generator that returns existing code in the first run' do
      let(:existing_code) { 'AAAA' }
      let(:spare_code) { 'BBBB' }

      before(:each) do
        allow(service)
        .to receive(:generate_attendance_code)
        .and_return(existing_code, spare_code)

        create(:interactive_session, attendance_code: existing_code)
      end

      describe 'interactive session' do
        it { is_expected.to have_attributes(attendance_code: spare_code) }
      end
    end

    context 'given sub of generator that returns always returns exting code' do
      let(:existing_code) { 'AAAA' }

      before(:each) do
        allow(service)
        .to receive(:generate_attendance_code)
        .and_return(existing_code)

        create(:interactive_session, attendance_code: existing_code)
      end

      it 'should raise record not unique exception' do
        expect { service.call }.to raise_error(ActiveRecord::RecordNotUnique)
      end
    end
  end

  context 'given invalid interactive session' do
    let(:params) { { label: 'My Session', owner: nil } }

    it { expect { service.call }.to raise_error(ActiveRecord::RecordInvalid) }
  end
end
