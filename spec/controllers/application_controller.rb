# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  controller do
    def index; end
  end

  describe 'session management' do
    def fire_get
      get 'index', session: given_session
    end

    context 'given empty session' do
      let(:given_session) { {} }
      let(:created_user) { User.last }

      it 'should create a new user' do
        expect { fire_get }.to change { User.count }.by(1)
      end

      describe '#session' do
        subject { session.to_h }

        before(:each) { fire_get }

        it 'should include id of created user' do
          is_expected.to include('user_id' => created_user.id)
        end
      end

      describe '#current_user' do
        controller do
          def index
            render html: current_user.id
          end
        end
        subject { response.body }

        before(:each) { fire_get }

        it 'should return id of created user' do
          is_expected.to eql(created_user.id.to_s)
        end
      end
    end

    context 'given session with user id' do
      let!(:given_user) { create(:user) }
      let(:given_session) { { 'user_id' => given_user.id } }

      it 'should not create a new user' do
        expect { fire_get }.not_to change { User.count }
      end

      describe '#session' do
        subject { session.to_h }

        before(:each) { fire_get }

        it 'should include id of given user' do
          is_expected.to include('user_id' => given_user.id)
        end
      end

      describe '#current_user' do
        controller do
          def index
            render html: current_user.id
          end
        end
        subject { response.body }

        before(:each) { fire_get }

        it 'should return id of given user' do
          is_expected.to eql(given_user.id.to_s)
        end
      end
    end
  end
end
