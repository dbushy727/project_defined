class WorkoutSessionsController < ApplicationController

  def index
    users_workouts = WorkoutSession.where(user_id: current_user.id)

    exercise_instances_per_each_workout_session = {}

    users_workouts.each do |workout_session|

      workout_date = workout_session.workout_date.to_i
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
    # Parameters: {"date"=>"2014-3-2"}
    # Formatting for db query:
      # start_date = '2014-03-02 0:0:0'
      # finish_date = '2014-03-02 23:59:59'

    date = WorkoutSession.parse_utc(params[:date])

    workout_sessions_on_given_day = WorkoutSession.where(user_id: current_user.id).where("workout_date >= ? AND workout_date <= ?", date[:start_date_utc], date[:finish_date_utc])

    given_day_data = []

    #<WorkoutSession id: 1, title: "Cardio", user_id: 1, workout_id: 1, created_at: "2014-03-02 20:53:37", updated_at: "2014-03-02 20:53:37">

    workout_sessions_on_given_day.each do |workout_session|
      exercises = []


      workout_session.exercise_instances.each do |exercise|
        puts exercise
        exercise_instance = {
                            id: exercise.id,
                            exercise: Exercise.find(exercise.exercise_id),
                            set: exercise.set,
                            reps: exercise.reps,
                            weight: exercise.weight,
                            seconds: exercise.seconds,
                            created_at: exercise.created_at,
                            updated_at: exercise.updated_at,
                            }
        exercises << exercise_instance
      end

      data_session = { 
                  id: workout_session.id,
                  title: workout_session.title,
                  user_id: workout_session.user_id,
                  workout_id: workout_session.workout_id,
                  workout_date: workout_session.workout_date,
                  exercise_instances: exercises
                }
      given_day_data << data_session
    end

    render :json => { workouts: given_day_data, day: params[:date] }

  end


  def create
    my_session = WorkoutSession.create({
                          title: params[:workout_title],
                          workout_id: params[:workout_id],
                          workout_date: Time.parse(params[:workout_date]),
                          user_id: current_user.id
                        })
    session[:workout_session_id] = my_session.id
    render json: {workout_session: my_session}
  end

end