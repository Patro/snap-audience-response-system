# frozen_string_literal: true

RSpec.shared_examples 'get collection of resources' do |model_class:, with_filter: false|
  context 'given no records' do
    let!(:records) { }

    before(:each) { fire_get }

    describe 'response' do
      subject { response }

      it { is_expected.to have_http_status(:ok) }
      it { is_expected.to have_json_api_content_type }

      describe 'meta' do
        subject { json['meta'] }

        it { is_expected.to include('total' => 0) }
      end

      describe 'data' do
        subject { json['data'] }

        it { is_expected.to be_empty }
      end
    end
  end

  context 'given records' do
    context 'given scope that permits access' do
      unlock_scope(model_class)

      before(:each) { fire_get }

      describe 'response' do
        subject { response }

        it { is_expected.to have_http_status(:ok) }
        it { is_expected.to have_json_api_content_type }

        describe 'meta' do
          subject { json['meta'] }

          it { is_expected.to include('total' => records.length) }
        end

        describe 'data' do
          subject { json['data'] }

          it { is_expected.to include_identifier_of(records) }
          if with_filter
            it { is_expected.not_to include_identifier_of(non_matching_records) }
          end
        end
      end
    end

    context 'given scope that denies access' do
      block_scope(model_class)

      before(:each) { fire_get }

      describe 'response' do
        subject { response }

        it { is_expected.to have_http_status(:ok) }
        it { is_expected.to have_json_api_content_type }

        describe 'meta' do
          subject { json['meta'] }

          it { is_expected.to include('total' => 0) }
        end

        describe 'data' do
          subject { json['data'] }

          it { is_expected.not_to include_identifier_of(records) }
          if with_filter
            it { is_expected.not_to include_identifier_of(non_matching_records) }
          end
        end
      end
    end
  end
end

RSpec.shared_examples 'create resource' do |model_class:|
  context 'given policy that permits access' do
    permit_action(model_class, :create?)

    it 'should create record' do
      expect { fire_post }.to change { model_class.count }.from(0).to(1)
    end

    describe 'response' do
      subject { response }

      before(:each) { fire_post }

      it { is_expected.to have_http_status(:created) }
      it { is_expected.to have_json_api_content_type }

      describe 'data' do
        subject { json['data'] }

        it { is_expected.to include_identifier_of(created_record) }
      end

      describe 'location header' do
        subject { response.get_header('Location') }

        it { is_expected.to end_with("#{created_record.id}") }
      end
    end

    describe 'created record' do
      subject { created_record }

      before(:each) { fire_post }

      it { is_expected.to have_attributes(expected_record_attributes) }
    end
  end

  context 'given policy that denies access' do
    deny_action(model_class, :create?)

    it 'should not create record' do
      expect { fire_post }.not_to change { model_class.count }
    end

    describe 'response' do
      subject { response }

      before(:each) { fire_post }

      it { is_expected.to have_http_status(:forbidden) }
      it { is_expected.to have_json_api_content_type }
    end
  end
end

RSpec.shared_examples 'fail to create resource' do |model_class:, status:|
  context 'given policy that permits access' do
    permit_action(model_class, :create?)

    it 'should not change number of records' do
      expect { fire_post }.not_to change { model_class.count }
    end

    describe 'response' do
      subject { response }

      before(:each) { fire_post }

      it { is_expected.to have_http_status(:unprocessable_entity) }
      it { is_expected.to have_json_api_content_type }
    end
  end
end

RSpec.shared_examples 'get resource' do |model_class:|
  context 'given non existing id' do
    let(:id) { 1234 }

    before(:each) { fire_get }

    describe 'response' do
      subject { response }

      it { is_expected.to have_http_status(:not_found) }
      it { is_expected.to have_json_api_content_type }
    end
  end

  context 'given existing id' do
    let(:id) { record.id }

    context 'given policy and scope that permits access' do
      permit_action(model_class, :show?)
      unlock_scope(model_class)

      before(:each) { fire_get }

      describe 'response' do
        subject { response }

        it { is_expected.to have_http_status(:ok) }
        it { is_expected.to have_json_api_content_type }

        describe 'data' do
          subject { json['data'] }

          it { is_expected.to include_identifier_of(record) }
        end
      end
    end

    context 'given policy that denies access' do
      deny_action(model_class, :show?)
      unlock_scope(model_class)

      before(:each) { fire_get }

      describe 'response' do
        subject { response }

        it { is_expected.to have_http_status(:forbidden) }
        it { is_expected.to have_json_api_content_type }
      end
    end

    context 'given scope that denies access' do
      permit_action(model_class, :show?)
      block_scope(model_class)

      before(:each) { fire_get }

      describe 'response' do
        subject { response }

        it { is_expected.to have_http_status(:not_found) }
        it { is_expected.to have_json_api_content_type }
      end
    end
  end
end

RSpec.shared_examples 'update resource' do |model_class:, expect_changes: true|
  context 'given non existing id' do
    let(:id) { 1234 }

    before(:each) { fire_patch }

    describe 'response' do
      subject { response }

      it { is_expected.to have_http_status(:not_found) }
      it { is_expected.to have_json_api_content_type }
    end
  end

  context 'given existing id' do
    let(:id) { record.id }

    context 'given policy that permits access' do
      permit_action(model_class, :update?)

      unless expect_changes
        it 'should not change attributes of record' do
          expect { fire_patch }.not_to change { record.reload.attributes }
        end
      end

      describe 'response' do
        subject { response }

        before(:each) { fire_patch }

        it { is_expected.to have_http_status(:ok) }
        it { is_expected.to have_json_api_content_type }

        describe 'data' do
          subject { json['data'] }

          it { is_expected.to include_identifier_of(updated_record) }
        end
      end

      describe 'updated record' do
        subject { updated_record }

        before(:each) { fire_patch }

        if expect_changes
          it { is_expected.to have_attributes(expected_record_attributes) }
        end
      end
    end

    context 'given policy that denies access' do
      deny_action(model_class, :update?)

      before(:each) { fire_patch }

      describe 'response' do
        subject { response }

        it { is_expected.to have_http_status(:forbidden) }
        it { is_expected.to have_json_api_content_type }
      end
    end
  end
end

RSpec.shared_examples 'delete resource' do |model_class:|
  context 'given non existing id' do
    let(:id) { 1234 }

    before(:each) { fire_delete }

    describe 'response' do
      subject { response }

      it { is_expected.to have_http_status(:not_found) }
      it { is_expected.to have_json_api_content_type }
    end
  end

  context 'given existing id' do
    let(:id) { record.id }

    context 'given policy that permits access' do
      permit_action(model_class, :destroy?)

      it 'should destroy record' do
        expect { fire_delete }.to change { model_class.count }.from(1).to(0)
      end

      describe 'response' do
        subject { response }

        before(:each) { fire_delete }

        it { is_expected.to have_http_status(:no_content) }

        describe 'body' do
          subject { response.body }

          it { is_expected.to be_empty }
        end
      end

      describe 'record' do
        before(:each) { fire_delete }

        it 'should not exist anymore' do
          expect { record.reload }
          .to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end

    context 'given policy that denies access' do
      deny_action(model_class, :update?)

      it 'should not destroy record' do
        expect { fire_delete }.not_to change { model_class.count }
      end

      describe 'response' do
        subject { response }

        before(:each) { fire_delete }

        it { is_expected.to have_http_status(:forbidden) }
        it { is_expected.to have_json_api_content_type }
      end
    end
  end
end
