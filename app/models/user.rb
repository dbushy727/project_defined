class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :schedules, dependent: :destroy
  has_many :workouts, through: :schedule, dependent: :destroy
  has_many :exercise_instances, dependent: :destroy
  has_many :exercises, dependent: :destroy
end
