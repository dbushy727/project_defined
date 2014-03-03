class WorkoutSessionsController < ApplicationController

  def index
    users_workouts = WorkoutSession.where(user_id: current_user.id)
    users_workouts = WorkoutSession.where(user_id: 1)

    exercise_instances_per_each_workout_session = {}


    users_workouts.each do |workout_session|
      # Note: if the user creates multiple workout sessions at the exact same time, down to the millisecond, then the last one created at that same instant will overwrite all the previous ones.

      workout_date = workout_session.created_at.to_i
      number_of_sets = workout_session.exercise_instances.length

      if exercise_instances_per_each_workout_session["#{workout_date}"] != nil
        exercise_instances_per_each_workout_session["#{workout_date}"] += number_of_sets
      else
        exercise_instances_per_each_workout_session["#{workout_date}"] = number_of_sets
      end

    end

    render :json => exercise_instances_per_each_workout_session
  end

  def workout_session_data
    # Parameters: {"date"=>"Sun Mar 02 2014 00:00:00 GMT-0500 (EST)"}

    date = params[:date]

    workout_session = WorkoutSession.where(created_at: date)
    p workout_session

  end


  def create
    # workout_session = WorkoutSession.create({
    #   user_id: current_user.id,
    #   title: ,
    #   workout_id: params[:workout_id] 
    #   })
    
  end
end