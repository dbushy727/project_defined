class WorkoutsController < ApplicationController

  def index
    workouts = Workout.where(user_id: current_user.id)
    json_workouts = { workouts: workouts }

    respond_to do |format|
        format.html
        format.json { render :json => json_workouts }
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

  def add_exercise_to_workout
    puts params
    render :json => "Hello"
    # @exercise = Exercise.find_by_title(params[:title])
  end

end