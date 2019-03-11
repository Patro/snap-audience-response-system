# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  describe 'session management' do
    controller do
      def index; end
    end

    def fire_request
      get 'index', session: given_session
    end

    context 'given empty session' do
      let(:given_session) { {} }
      let(:created_user) { User.last }

      it 'should create a new user' do
        expect { fire_request }.to change { User.count }.by(1)
      end

      describe '#session' do
        subject { session.to_h }

        before(:each) { fire_request }

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

        before(:each) { fire_request }

        it 'should return id of created user' do
          is_expected.to eql(created_user.id.to_s)
        end
      end
    end

    context 'given session with user id' do
      let!(:given_user) { create(:user) }
      let(:given_session) { { 'user_id' => given_user.id } }

      it 'should not create a new user' do
        expect { fire_request }.not_to change { User.count }
      end

      describe '#session' do
        subject { session.to_h }

        before(:each) { fire_request }

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

        before(:each) { fire_request }

        it 'should return id of given user' do
          is_expected.to eql(given_user.id.to_s)
        end
      end
    end
  end

  describe 'unauthorized error' do
    controller do
      def index
        raise Pundit::NotAuthorizedError
      end
    end

    before(:each) { get 'index' }

    describe 'response' do
      let(:json) { JSON.parse(response.body) }

      subject { response }

      it { is_expected.to have_http_status(:forbidden) }
      it { is_expected.to have_json_api_content_type }

      describe 'first error' do
        subject { json['errors'].first }

        it { is_expected.to include('status' => '403') }
        it { is_expected.to include('title' => 'Non authorized action') }
        it { is_expected.to include('detail' => 'The current user is not authorized to perform this action.') }
      end
    end
  end

  describe 'record invalid error' do
    before(:each) do
      stub_const('TestRecord', Class.new)
      TestRecord.class_eval do
        include ActiveModel::Model
        attr_accessor :name
        validates :name, presence: true
      end
    end

    controller do
      def index
        invalid_record = TestRecord.new(name: nil)
        invalid_record.validate
        raise ActiveRecord::RecordInvalid, invalid_record
      end
    end

    before(:each) { get 'index' }

    describe 'response' do
      let(:json) { JSON.parse(response.body) }

      subject { response }

      it { is_expected.to have_http_status(:unprocessable_entity) }
      it { is_expected.to have_json_api_content_type }

      describe 'first error' do
        subject { json['errors'].first }

        it { is_expected.to include('status' => '422') }
        it { is_expected.to include('title' => 'Resource can not be processed') }
        it { is_expected.to include('detail' => 'Name can\'t be blank.') }
      end
    end
  end
end
