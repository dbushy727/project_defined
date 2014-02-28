class Workout < ActiveRecord::Base

  belongs_to :user
  has_many :workout_sessions
  has_many :workout_lists, dependent: :destroy
  has_many :exercises, through: :workout_lists
end
