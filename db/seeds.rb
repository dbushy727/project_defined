puts "==========================="
puts "Seed Task Started"
puts "==========================="

User.delete_all
puts "[Notice] Users deleted"

20.times do
  first_name  = Faker::Name.first_name
  last_name   = Faker::Name.last_name
  password    = "password123",
  email       = Faker::Internet.email(first_name+" "+last_name)

  new_user = User.create({
              email:      email,
              password:   password,
              username:   first_name.downcase[0]+last_name.downcase,
              first_name: first_name,
              last_name:  last_name
              })
  puts "[User] #{new_user.first_name} created"

  exercise_list = ['Standard Push-Ups', 'Wide Front Pull-Ups', 'Wide Fly Push-Ups', 'Diamond Push-Ups', 'Back Flys', 'Chair Dips', 'Deep Swimmer Presses', 'Static Arm Curls', 'Seated Two-Angle Shoulder Flys']

  exercise_list.each do |exercise|
    new_exercise = Exercise.create({
                                    title: exercise
                                    })


end



puts "==========================="
puts "Seed Task Complete"
puts "==========================="