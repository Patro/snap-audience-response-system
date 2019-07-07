# frozen_string_literal: true

module CurrentUserHelpers
  extend ActiveSupport::Concern

  class_methods do
    def set_current_user
      provide_current_user
      stub_current_user_method
    end

    private

      def provide_current_user
        let(:current_user) { create(:user) }
      end

      def stub_current_user_method
        before(:each) do
          allow_any_instance_of(ApplicationController)
          .to receive(:current_user)
          .and_return(current_user)

          allow_any_instance_of(ApplicationController)
          .to receive(:initialize_session)

          allow_any_instance_of(ApplicationCable::Connection)
          .to receive(:find_current_user)
          .and_return(current_user)
        end
      end
  end
end
