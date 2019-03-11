# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationService do
  let(:service) { ApplicationService.new }

  it { expect { service.call }.to raise_error(NotImplementedError) }
end
