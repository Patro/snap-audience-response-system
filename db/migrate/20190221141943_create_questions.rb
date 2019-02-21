# frozen_string_literal: true

class CreateQuestions < ActiveRecord::Migration[5.2]
  def change
    create_table :questions do |t|
      t.string :type, null: false
      t.text :text, null: false
      t.belongs_to :interactive_session, foreign_key: true

      t.timestamps
    end
  end
end
