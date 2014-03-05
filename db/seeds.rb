puts "==========================="
puts "Seed Task Started"
puts "==========================="


User.delete_all
puts "[Notice] Users deleted"

5.times do
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
  workout_list = ['Cardio', 'Yoga']
  n = 75
  w=50
  workout_list.each do |workout|
    new_workout = Workout.create({
                                  title: workout,
                                  user_id: new_user.id
                                  })
    puts "[Workout] #{new_workout.title} added to #{new_workout.user.first_name}"
    35.times do
      x=1
      

      new_sesh = WorkoutSession.create({
                              title: new_workout.title,
                              user_id: new_user.id,
                              workout_id: new_workout.id,
                              workout_date: n.days.ago
                              })

      (2..7).to_a.sample.times do
        ex_instance = ExerciseInstance.create({
                                                workout_session_id: new_sesh.id,
                                                user_id: User.first.id,
                                                exercise_id: (1..9).to_a.sample,
                                                set: x,
                                                reps: (5..20).to_a.sample,
                                                weight: w*(2.0/((1..4).to_a.sample)) 
          })
        w+=1
        x+=1
      end
      n-=1
    end 
  end

end


# p "Workout Session Day 0 Changed"
# t = WorkoutSession.all[0]
# p "Original created at: #{t.workout_date.to_s}"
# t.workout_date = ((rand*10)+1).round.days.ago
# p "Changed created at: #{t.workout_date.to_s}"
# t.save
# p "Confirming change was committed to database: #{WorkoutSession.all[0].workout_date.to_s}"

# p "Workout Session Day 1 Changed"
# u = WorkoutSession.all[1]
# p "Original created at: #{t.workout_date.to_s}"
# u.workout_date = ((rand*10)+1).round.days.ago
# p "Changed created at: #{t.workout_date.to_s}"
# u.save
# p "Confirming change was committed to database: #{WorkoutSession.all[1].workout_date.to_s}"

# p "Workout Session Day 2 Changed"
# v = WorkoutSession.all[2]
# p "Original created at: #{t.workout_date.to_s}"
# v.workout_date = ((rand*10)+1).round.days.ago
# p "Changed created at: #{t.workout_date.to_s}"
# v.save
# p "Confirming change was committed to database: #{WorkoutSession.all[2].workout_date.to_s}"


puts "==========================="
puts "Seed Task Complete"
puts "==========================="