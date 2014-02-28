class CreateExerciseInstances < ActiveRecord::Migration
  def change
    create_table :exercise_instances do |t|
      t.integer :workout_session_id
      t.integer :user_id
      t.integer :exercise_id
      t.integer :reps
      t.float   :weight
      t.integer :seconds

      t.timestamps
    end
  end
end
