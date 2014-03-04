class ExercisesController < ApplicationController

  def index
    exercises = Exercise.where(user_id: current_user.id)

    json_exercises = { exercises: exercises }
    respond_to do |format|
        format.html
        format.json { render :json => exercises }
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
                              instance_weight:  instance.weight,
                              product_weight:   instance.reps*instance.weight,
                              sum_product:      instance.reps*instance.weight,
                              weighted_average: (instance.reps*instance.weight)/instance.reps,
                              total_seconds:    instance.seconds,
                              lowest_weight:    instance.weight,
                              highest_weight:   instance.weight
                              }

          queried_exercise[:exercise_history] << historical_event

      elsif queried_exercise[:exercise_history].last[:created_at] == instance.created_at

        # Lowest Weight
        if queried_exercise[:exercise_history].last[:lowest_weight] > instance.weight
          queried_exercise[:exercise_history].last[:lowest_weight] = instance.weight
        end

        # Highest Weights
        if queried_exercise[:exercise_history].last[:highest_weight] < instance.weight
          queried_exercise[:exercise_history].last[:highest_weight] = instance.weight
        end

        # Total number of sets
        unless queried_exercise[:exercise_history].last[:total_sets] == nil
          queried_exercise[:exercise_history].last[:total_sets] = instance.set
        end

        # Total number of reps
        unless queried_exercise[:exercise_history].last[:total_reps] == nil
          queried_exercise[:exercise_history].last[:total_reps] += instance.reps
        end

        # Sum of products
        unless queried_exercise[:exercise_history].last[:sum_product] == nil
          queried_exercise[:exercise_history].last[:sum_product] += instance.weight*instance.reps
        end

        # Weighted Average
        unless queried_exercise[:exercise_history].last[:weighted_average] == nil
          queried_exercise[:exercise_history].last[:weighted_average] = queried_exercise[:exercise_history].last[:sum_product]/queried_exercise[:exercise_history].last[:total_reps]
        end

        # Total seconds
        unless queried_exercise[:exercise_history].last[:total_seconds] == nil
          queried_exercise[:exercise_history].last[:total_seconds] += instance.seconds
        end

      end
    end

    render :json => {message: "Exercise history queried", data: queried_exercise}
  end

end

