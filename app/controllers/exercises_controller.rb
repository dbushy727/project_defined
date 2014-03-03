class ExercisesController < ApplicationController

  def index
    exercises = Exercise.where(user_id: current_user.id)

    json_exercises = { exercises: exercises }
    respond_to do |format|
        format.html
        format.json { render :json => json_exercises }
    end
  end

  def new
    @exercise = Exercise.new
  end

  def create
    if Exercise.where(user_id: current_user.id, title: params[:exercise]["title"]).first == nil
      exercise = Exercise.create(title: params[:exercise]["title"], user_id: current_user.id)
      render :json => {message: "Exercise created", exercise: exercise}
    else
      render :json => {message: "This exercise already exists for this user"}
    end
  end

  def show
    @exercises = Exercise.where(user_id: params[:id])
    respond_to do |format|
        format.html
        format.json { render :json => @exercises }
    end
  end

  def destroy
    # Parameters: {"exercise"=>{"title"=>"w_test"}, "id"=>":id"}

    exercise_to_delete = Exercise.where(user_id: current_user.id, title: params[:exercise][:title])

    exercise_to_delete.first.destroy

    render :json => {message: "Exercise deleted"}
  end


  def history
    # Parameters: {"id"=>"1"}

    exercise = Exercise.find_by(user_id: current_user.id, id: params[:id])
    exercise_history = exercise.exercise_instances

    # Exercise_history Returns:
    # -------------------------
    #<ActiveRecord::Associations::CollectionProxy [#<ExerciseInstance id: 1, workout_session_id: 1, user_id: 1, exercise_id: 1, set: 1, reps: 10, weight: 100.0, seconds: nil, created_at: "2014-03-02 20:53:39", updated_at: "2014-03-02 20:53:39">, #<ExerciseInstance id: 2, workout_session_id: 1, user_id: 1, exercise_id: 1, set: 2, reps: 8, weight: 110.0, seconds: nil, created_at: "2014-03-02 20:53:39", updated_at: "2014-03-02 20:53:39">, #<ExerciseInstance id: 3, workout_session_id: 1, user_id: 1, exercise_id: 1, set: 3, reps: 6, weight: 130.0, seconds: nil, created_at: "2014-03-02 20:53:39", updated_at: "2014-03-02 20:53:39">]>

    queried_exercise = { exercise_history: [] }

    exercise_history.each do |instance|

      if queried_exercise[:exercise_history].last == nil
        historical_event = {
                              title:            exercise.title,
                              created_at:       instance.created_at,
                              total_sets:       instance.set,
                              total_reps:       instance.reps,
                              weighted_average: instance.weight,
                              total_seconds:    instance.seconds
                              }
          queried_exercise[:exercise_history] << historical_event
      else queried_exercise[:exercise_history].last[:created_at] == instance.created_at
        unless queried_exercise[:exercise_history].last[:total_reps] == nil
          queried_exercise[:exercise_history].last[:total_reps] += instance.reps
        end
        unless queried_exercise[:exercise_history].last[:total_seconds] == nil
          queried_exercise[:exercise_history].last[:total_seconds] += instance.seconds
        end
        unless queried_exercise[:exercise_history].last[:total_sets] == nil
          queried_exercise[:exercise_history].last[:total_sets] = instance.set
        end
      end
    end

    render :json => {message: "Exercise history queried", data: queried_exercise}
  end

end

