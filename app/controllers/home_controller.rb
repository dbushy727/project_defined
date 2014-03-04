class HomeController < ApplicationController

  def index; end

  def history
    exercise_info = ExerciseInstance.where(user_id: current_user.id)
    json_exercises = { exercise_instances: exercise_info }
    respond_to do |format|
        format.html
        format.json { render :json => json_exercises }
    end
  end
  
end