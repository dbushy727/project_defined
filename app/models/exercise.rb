class Exercise < ActiveRecord::Base

  has_many :workout_lists
  has_many :exercise_instances
  belongs_to :user

  def hide
    self.visible_to_user = false
    self.save
  end

  def add_or_update_exercise_instance_history(exercise_history)
    queried_exercise = { exercise_history: [] }

    exercise_history.each do |instance|

      if queried_exercise[:exercise_history] == [] || queried_exercise[:exercise_history].last[:created_at] != instance.created_at
        historical_event = {
                              title:            self.title,
                              workout_date:     WorkoutSession.find(instance.workout_session_id).workout_date,
                              workout_session_id: WorkoutSession.find(instance.workout_session_id).id,
                              created_at:       instance.created_at,
                              total_sets:       instance.set,
                              total_reps:       instance.reps,
                              instance_weight:  instance.weight,
                              product_weight:   instance.reps*instance.weight,
                              sum_product:      instance.reps*instance.weight,
                              weighted_average: (instance.reps*instance.weight)/instance.reps,
                              total_seconds:    instance.seconds,
                              lowest_weight:    instance.weight,
                              highest_weight:   instance.weight
                              }

          queried_exercise[:exercise_history] << historical_event

      else queried_exercise[:exercise_history].last[:created_at] == instance.created_at

        # Lowest Weight
        if queried_exercise[:exercise_history].last[:lowest_weight] > instance.weight
          queried_exercise[:exercise_history].last[:lowest_weight] = instance.weight
        end

        # Highest Weights
        if queried_exercise[:exercise_history].last[:highest_weight] < instance.weight
          queried_exercise[:exercise_history].last[:highest_weight] = instance.weight
        end

        # Total number of sets
        unless queried_exercise[:exercise_history].last[:total_sets] == nil
          queried_exercise[:exercise_history].last[:total_sets] = instance.set
        end

        # Total number of reps
        unless queried_exercise[:exercise_history].last[:total_reps] == nil
          queried_exercise[:exercise_history].last[:total_reps] += instance.reps
        end

        # Sum of products
        unless queried_exercise[:exercise_history].last[:sum_product] == nil
          queried_exercise[:exercise_history].last[:sum_product] += instance.weight*instance.reps
        end

        # Weighted Average
        unless queried_exercise[:exercise_history].last[:weighted_average] == nil
          queried_exercise[:exercise_history].last[:weighted_average] = queried_exercise[:exercise_history].last[:sum_product]/queried_exercise[:exercise_history].last[:total_reps]
        end

        # Total seconds
        unless queried_exercise[:exercise_history].last[:total_seconds] == nil
          queried_exercise[:exercise_history].last[:total_seconds] += instance.seconds
        end
      end
    end

    return queried_exercise

  end

end
