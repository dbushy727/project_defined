class WorkoutSession < ActiveRecord::Base

  belongs_to :user
  belongs_to :workout
  has_many   :exercise_instances

end
