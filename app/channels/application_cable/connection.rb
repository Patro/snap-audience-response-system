# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      reject_unauthorized_connection if current_user.blank?
    end

    def current_user
      @current_user ||= find_current_user
    end

    private
      def find_current_user
        User.find_by(id: user_id)
      end

      def user_id
        cookies.encrypted[:ars_user_session]['user_id'].to_i
      end
  end
end
