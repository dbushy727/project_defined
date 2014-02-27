class WorkoutsController < ApplicationController

  def index
    @workouts = Workout.all
    respond_to do |format|
        format.html
        format.json { render :json => @workouts }
    end
  end

  def new
    @workout = Workout.new
  end
  def create
    @workout = Workout.create(title: params[:workout]["title"], user_id: current_user.id)
    redirect_to :root
  end
  def show
    @workouts = Workout.where(user_id: params[:id])
    respond_to do |format|
        format.html
        format.json { render :json => @workouts }
    end
  end
end