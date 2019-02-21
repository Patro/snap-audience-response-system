# frozen_string_literal: true

class CreateAttendances < ActiveRecord::Migration[5.2]
  def change
    create_table :attendances, primary_key: [:attendee_id, :interactive_session_id] do |t|
      t.belongs_to :attendee, foreign_key: { to_table: :users }, null: false
      t.belongs_to :interactive_session, foreign_key: true, null: false
      t.datetime :created_at, null: false
    end
  end
end
