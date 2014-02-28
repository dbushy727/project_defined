class WorkoutsController < ApplicationController

  def index
    # workouts = Workout.where(user_id: 21)
    workouts = Workout.where(user_id: current_user.id)

    # workouts.each do |workout|
    #   workouts[:exercies] = workout.exercises
    # end
    
    workouts.each do |w|
      w.exercises.each do |e|
        puts e.title
      end
    end

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
    if Workout.where(user_id: current_user.id, title: params[:workout]["title"]).first == nil
      workout = Workout.create(title: params[:workout]["title"], user_id: current_user.id)
      render :json => {message: "Workout created", workout: workout}
    else
      render :json => {message: "This workout already exists for this user"}
    end
  end

  def show
    @workouts = Workout.where(user_id: params[:id])
    respond_to do |format|
        format.html
        format.json { render :json => @workouts }
    end
  end

  def add_exercise_to_workout
    # Parameters: {"exercise"=>"Wide Front Pull-Ups", "workout"=>"Cardio"}
    # User.where(:username => "Paul").includes(:domains).where("domains.name" => "paul-domain").limit(1)

    exercise_to_add_to_workout = Exercise.where(user_id: current_user.id, title: params[:exercise])
    workout = Workout.where(user_id: current_user.id, title: params[:workout])

    if WorkoutList.where(workout_id: workout, exercise_id: exercise_to_add_to_workout).first == nil
      workout.first.exercises << exercise_to_add_to_workout
      render :json => {workout: workout, exercise: exercise_to_add_to_workout, message: "Relation made"}
    else
      render :json => {message: "Relation already exists"}
    end

  end


end