# frozen_string_literal: true

class CreateInteractiveSessions < ActiveRecord::Migration[5.2]
  def change
    create_table :interactive_sessions do |t|
      t.string :label
      t.string :attendance_code, limit: 4
      t.belongs_to :owner, foreign_key: { to_table: :users }, null: false
      t.timestamps

      t.index :attendance_code, unique: true
    end
  end
end
