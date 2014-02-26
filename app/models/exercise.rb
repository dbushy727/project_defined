class Exercise < ActiveRecord::Base

  has_many :workout_lists
  has_many :exercise_instances
  belongs_to :user

end
