# frozen_string_literal: true

module ApplicationCable
  class InteractiveSessionChannel < Channel
    def subscribed
      reject unless interactive_session.present? && show_access?
      stream_for interactive_session
    end

    private
      def show_access?
        Pundit.policy!(current_user, interactive_session).show?
      end

      def interactive_session
        @interactive_session ||= find_interactive_session
      end

      def find_interactive_session
        InteractiveSession.find_by(id: params[:id])
      end
  end
end
