class ExerciseInstance < ActiveRecord::Base


  belongs_to :user
  belongs_to :schedule
  belongs_to :exercise
  
end
