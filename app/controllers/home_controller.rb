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
    @exercise_info = ExerciseInstance.where(user_id: current_user.id)
  end
  
end