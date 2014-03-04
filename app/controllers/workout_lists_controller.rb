class WorkoutListsController < ApplicationController

  def create
    @workout_list = WorkoutList.create(exercise_id: params[:exercise_id], workout_id: params[:workout_id])
  end


end