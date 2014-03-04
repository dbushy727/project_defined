class ExerciseInstancesController < ApplicationController

  def index
    exercise_instances = ExerciseInstance.where(
                                                  user_id: current_user.id,
                                                  workout_session_id: session[:workout_session_id],
                                                  exercise_id: params[:exercise_id]
                                                  )
    json_exercise_instances = {exercise_instances: exercise_instances}
    respond_to do |format|
      format.html
      format.json { render json: json_exercise_instances}
    end
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

  def update
    puts "MY PARAMS=========="
    p params
    puts "MY PARAMS=========="
    exercise_instance = ExerciseInstance.find_by(
                            user_id: current_user.id,
                            workout_session_id: session[:workout_session_id],
                            exercise_id: params[:exercise_id],
                            set: params[:set_id]
                          )
    exercise_instance.reps = params[:reps]
    exercise_instance.weight = params[:weight]
    exercise_instance.save!
    redirect_to root_path
  end

end
