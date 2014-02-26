class Workout < ActiveRecord::Base

  has_many :schedules
  has_many :workout_lists, dependent: :destroy
  has_many :exercises, through: :workout_lists
end
