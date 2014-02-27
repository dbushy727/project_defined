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
    @exercise = Exercise.create(title: params[:exercise]["title"], user_id: current_user.id)
  end
  def show
    @exercises = Exercise.where(user_id: params[:id])
    respond_to do |format|
        format.html
        format.json { render :json => @exercises }
    end
  end
end
