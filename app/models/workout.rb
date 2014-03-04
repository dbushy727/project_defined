class Workout < ActiveRecord::Base

  belongs_to :user
  has_many :workout_sessions
  has_many :workout_lists, dependent: :destroy
  has_many :exercises, through: :workout_lists

  def parse_for_handlebars
          hash = {
              id: self.id,
              title: self.title,
              user_id: self.user_id,
              created_at: self.created_at,
              updated_at: self.updated_at,
              exercises: self.exercises
              }
      return hash
  end



end
