class ExercisesController < ApplicationController

  def index
    @exercises = Exercise.all
    respond_to do |format|
        format.html
        format.json { render :json => @exercises }
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