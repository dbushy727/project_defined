class HomeController < ApplicationController

  def index
    unless current_user
      redirect_to new_user_session_path
    end
  end

  def history
    unless current_user
      redirect_to new_user_session_path
    end
    exercise_info = ExerciseInstance.where(user_id: 1)
    json_exercises = { exercise_instances: exercise_info }
    respond_to do |format|
        format.html
        format.json { render :json => json_exercises }
    end
  end
  
end