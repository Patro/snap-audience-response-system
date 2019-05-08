# frozen_string_literal: true

class AddPositionToQuestionOptions < ActiveRecord::Migration[5.2]
  def change
    change_table :question_options do |t|
      t.integer :position, null: false
      t.index [:question_id, :position], unique: true
    end
  end
end
