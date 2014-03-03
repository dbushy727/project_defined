class ExerciseInstancesController < ApplicationController

  def index
    exercise_instances = ExerciseInstance.where(user_id: current_user.id    )
  end

  def new
  end

  def create
    @exercise_instance = ExerciseInstance.create(
      user_id: current_user.id,
      workout_session_id: params[:workout_session_id],
      exercise_id: params[:exercise_id],
      reps: params[:reps],
      weight: params[:weight],
      seconds: params[:seconds]
      )
  end
end
