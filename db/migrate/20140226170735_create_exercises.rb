class CreateExercises < ActiveRecord::Migration
  def change
    create_table :exercises do |t|
      t.string  :title
      t.boolean :visible_to_user, :default => true
      t.integer :user_id

      t.timestamps
    end
  end
end
