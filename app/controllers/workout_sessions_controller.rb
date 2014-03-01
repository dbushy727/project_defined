class WorkoutSessionsController < ApplicationController

  def index

  end


  def create
    workout_session = WorkoutSession.create({
      user_id: current_user.id,
      title: ,
      workout_id: params[:workout_id] 
      })
    
  end
end