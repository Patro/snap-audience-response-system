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

ActiveRecord::Schema.define(version: 2019_02_20_183958) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "interactive_sessions", force: :cascade do |t|
    t.string "label"
    t.string "attendance_code", limit: 4
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["attendance_code"], name: "index_interactive_sessions_on_attendance_code", unique: true
    t.index ["owner_id"], name: "index_interactive_sessions_on_owner_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
  end

  add_foreign_key "interactive_sessions", "users", column: "owner_id"
end
