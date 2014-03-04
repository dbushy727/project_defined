class CreateWorkoutSessions < ActiveRecord::Migration
  def change
    create_table :workout_sessions do |t|
      t.string    :title
      t.integer   :user_id
      t.integer   :workout_id
      t.datetime  :workout_date

      t.timestamps
    end
  end
end
