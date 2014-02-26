class WorkoutsController < ApplicationController

  def index
  end

  def new
    @workout = Workout.new
  end
  def create
    @workout = Workout.create(title: params[:workout]["title"], user_id: current_user.id)
    redirect_to :root
  end
end