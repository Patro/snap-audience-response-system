# frozen_string_literal: true

class CreateQuestionOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :question_options do |t|
      t.belongs_to :question, foreign_key: true, null: false
      t.text :text, null: false
      t.boolean :correct, null: false

      t.timestamps
    end
  end
end
