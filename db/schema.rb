# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_05_08_191328) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attendances", primary_key: ["attendee_id", "interactive_session_id"], force: :cascade do |t|
    t.bigint "attendee_id", null: false
    t.bigint "interactive_session_id", null: false
    t.datetime "created_at", null: false
    t.index ["attendee_id"], name: "index_attendances_on_attendee_id"
    t.index ["interactive_session_id"], name: "index_attendances_on_interactive_session_id"
  end

  create_table "interactive_sessions", force: :cascade do |t|
    t.string "label"
    t.string "attendance_code", limit: 4
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["attendance_code"], name: "index_interactive_sessions_on_attendance_code", unique: true
    t.index ["owner_id"], name: "index_interactive_sessions_on_owner_id"
  end

  create_table "polls", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.boolean "closed", default: false, null: false
    t.datetime "created_at", null: false
    t.index ["question_id"], name: "index_polls_on_question_id"
  end

  create_table "question_options", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.text "text", null: false
    t.boolean "correct", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position", null: false
    t.index ["question_id", "position"], name: "index_question_options_on_question_id_and_position", unique: true
    t.index ["question_id"], name: "index_question_options_on_question_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string "type", null: false
    t.text "text", null: false
    t.bigint "interactive_session_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["interactive_session_id"], name: "index_questions_on_interactive_session_id"
  end

  create_table "responses", primary_key: ["poll_id", "respondent_id", "picked_question_option_id"], force: :cascade do |t|
    t.bigint "picked_question_option_id", null: false
    t.bigint "poll_id", null: false
    t.bigint "respondent_id", null: false
    t.datetime "created_at", null: false
    t.index ["picked_question_option_id"], name: "index_responses_on_picked_question_option_id"
    t.index ["poll_id"], name: "index_responses_on_poll_id"
    t.index ["respondent_id"], name: "index_responses_on_respondent_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
  end

  add_foreign_key "attendances", "interactive_sessions"
  add_foreign_key "attendances", "users", column: "attendee_id"
  add_foreign_key "interactive_sessions", "users", column: "owner_id"
  add_foreign_key "polls", "questions"
  add_foreign_key "question_options", "questions"
  add_foreign_key "questions", "interactive_sessions"
  add_foreign_key "responses", "polls"
  add_foreign_key "responses", "question_options", column: "picked_question_option_id"
  add_foreign_key "responses", "users", column: "respondent_id"
end
