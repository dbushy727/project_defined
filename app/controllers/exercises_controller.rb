class ExercisesController < ApplicationController

  def index
    exercises = Exercise.where(user_id: current_user.id, visible_to_user: true)

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


  def update
    # Parameters: {"exercise"=>{"title"=>"Wide Front Pull-Ups"}, "id"=>":id"}

    exercise_to_hide = Exercise.find_by(user_id: current_user.id, title: params[:exercise][:title])
    exercise_to_hide.hide

    render :json => {message: "Exercise hidden"}

  end


  def history
    # Parameters: {"id"=>"1"}

    exercise = Exercise.find_by(user_id: current_user.id, id: params[:id])
    exercise_history = exercise.exercise_instances

    queried_exercise = exercise.add_or_update_exercise_instance_history(exercise_history)

    render :json => {message: "Exercise history queried", data: queried_exercise}
  end

end

