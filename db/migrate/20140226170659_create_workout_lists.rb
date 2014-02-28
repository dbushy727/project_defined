class CreateWorkoutLists < ActiveRecord::Migration
  def change
    create_table :workout_lists do |t|
      t.integer :workout_id
      t.integer :exercise_id
      t.string :exercise_title
      t.timestamps 
    end
  end
end
