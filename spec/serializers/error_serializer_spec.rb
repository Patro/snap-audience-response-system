# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ErrorSerializer do
  let(:serializer) { ErrorSerializer.new(error) }
  let(:errors) { serializer.serializable_hash[:errors] }

  context 'given error with status as integer' do
    let(:error) do
      build(
        :custom_error,
        title: 'Server Error',
        detail: 'A server error occured.',
        status: 500
      )
    end

    subject { errors }

    it { is_expected.to be_one }

    describe 'first error' do
      subject { errors.first }

      it { is_expected.to include(title: 'Server Error') }
      it { is_expected.to include(detail: 'A server error occured.') }
      it { is_expected.to include(status: '500') }
    end
  end

  context 'given error with status as symbol' do
    let(:error) { build(:custom_error, status: :internal_server_error) }

    describe 'first error' do
      subject { errors.first }

      it { is_expected.to include(status: '500') }
    end
  end
end
