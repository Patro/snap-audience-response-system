# frozen_string_literal: true

module PolicyHelpers
  extend ActiveSupport::Concern

  class_methods do
    def permit_action(model_class, action)
      policy = policy_of_model_class(model_class)
      stub_action_of_policy(policy, action) { true }
    end

    def deny_action(model_class, action)
      policy = policy_of_model_class(model_class)
      stub_action_of_policy(policy, action) { false }
    end

    def unlock_scope(model_class)
      policy = policy_of_model_class(model_class)
      stub_scope_of_policy(policy) { model_class.all }
    end

    def block_scope(model_class)
      policy = policy_of_model_class(model_class)
      stub_scope_of_policy(policy) { model_class.none }
    end

    private

      def policy_of_model_class(model_class)
        (model_class.to_s + 'Policy').constantize
      end

      def stub_action_of_policy(policy, action)
        before(:each) do
          allow_any_instance_of(policy)
          .to receive(action)
          .and_return(yield)
        end
      end

      def stub_scope_of_policy(policy)
        before(:each) do
          allow_any_instance_of(policy::Scope)
          .to receive(:resolve)
          .and_return(yield)
        end
      end
  end
end
