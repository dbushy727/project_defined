class WorkoutSession < ActiveRecord::Base

  belongs_to :user
  belongs_to :workout
  has_many   :exercise_instances

  def self.parse_utc(date)
    start_date = date+" 0:0:0"
    finish_date = date+" 23:59:59"

    ts = Time.parse(start_date)
    tf = Time.parse(finish_date)

    return {
            start_date_utc: ts.utc,
            finish_date_utc: tf.utc
            }
  end

end