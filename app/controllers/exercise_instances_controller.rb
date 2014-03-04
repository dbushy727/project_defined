class ExerciseInstancesController < ApplicationController

  def index
    exercise_instances = ExerciseInstance.where(user_id: current_user.id    )
  end

  def create
    n = 0
    params[:set_amount].to_i.times do |instance|
      n+=1
      exercise_instance = ExerciseInstance.create({
                                                    user_id: current_user.id,
                                                    workout_session_id: session[:workout_session_id],
                                                    exercise_id: params[:exercise_id],
                                                    set: n
                                                    })
    end
    render text: "Created #{n} exercise_instances"
  end
end
