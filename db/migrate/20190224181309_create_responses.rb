# frozen_string_literal: true

class CreateResponses < ActiveRecord::Migration[5.2]
  def change
    create_table :responses, primary_key: [:poll_id, :respondent_id, :picked_question_option_id] do |t|
      t.belongs_to :picked_question_option, foreign_key: { to_table: :question_options }, null: false
      t.belongs_to :poll, foreign_key: true, null: false
      t.belongs_to :respondent, foreign_key: { to_table: :users }, null: false
      t.datetime :created_at, null: false
    end
  end
end
