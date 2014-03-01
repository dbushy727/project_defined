puts "==========================="
puts "Seed Task Started"
puts "==========================="


User.delete_all
puts "[Notice] Users deleted"

20.times do
  first_name  = Faker::Name.first_name
  last_name   = Faker::Name.last_name
  password    = "password123"
  email       = Faker::Internet.email(first_name+" "+last_name)
  new_user = User.create({
              email:      email,
              password:   password,
              username:   first_name+last_name,
              first_name: first_name,
              last_name:  last_name
              })
  puts "[User] #{new_user.username} created"
# ===========================================
# ===========================================
  exercise_list = ['Standard Push-Ups', 'Wide Front Pull-Ups', 'Wide Fly Push-Ups', 'Diamond Push-Ups', 'Back Flys', 'Chair Dips', 'Deep Swimmer Presses', 'Static Arm Curls', 'Seated Two-Angle Shoulder Flys']
  exercise_list.each do |exercise|
    new_exercise = Exercise.create({
                                    title:    exercise,
                                    user_id:  new_user.id
                                    })
    puts "[Exercise] #{new_exercise.title} added to #{new_exercise.user.first_name}"
  end
# ===========================================
# ===========================================
  workout_list = ['Cardio', 'Lifting', 'Yoga']
  workout_list.each do |workout|
    new_workout = Workout.create({
                                  title: workout,
                                  user_id: new_user.id
                                  })
    puts "[Workout] #{new_workout.title} added to #{new_workout.user.first_name}"
    
    new_workout_session = WorkoutSession.create({
                                                title: new_workout.title,
                                                user_id: new_user.id,
                                                workout_id: new_workout.id
    })
    
  end

end

new_exercise_instance = ExerciseInstance.create({
                                                      workout_session_id: WorkoutSession.all.first.id,
                                                      user_id: User.all.first.id,
                                                      exercise_id: 1,
                                                      set: 1,
                                                      reps: 10,
                                                      weight: 100        
    })
new_exercise_instance = ExerciseInstance.create({
                                                      workout_session_id: WorkoutSession.all.first.id,
                                                      user_id: User.all.first.id,
                                                      exercise_id: 1,
                                                      set: 2,
                                                      reps: 8,
                                                      weight: 110        
    })
new_exercise_instance = ExerciseInstance.create({
                                                      workout_session_id: WorkoutSession.all.first.id,
                                                      user_id: User.all.first.id,
                                                      exercise_id: 1,
                                                      set: 3,
                                                      reps: 6,
                                                      weight: 130        
    })
puts "==========================="
puts "Seed Task Complete"
puts "==========================="