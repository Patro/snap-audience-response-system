# frozen_string_literal: true

class CreatePolls < ActiveRecord::Migration[5.2]
  def change
    create_table :polls do |t|
      t.belongs_to :question, foreign_key: true, null: false
      t.boolean :closed, null: false, default: false
      t.datetime :created_at, null: false
    end
  end
end
