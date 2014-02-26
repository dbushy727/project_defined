puts "==========================="
puts "Seed Task Started"
puts "==========================="

User.delete_all
puts "[Notice] Users deleted"

20.times do
  User.create({
    
    })
end



puts "==========================="
puts "Seed Task Complete"
puts "==========================="