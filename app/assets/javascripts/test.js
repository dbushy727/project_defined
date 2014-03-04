var assert = require ("assert");
require("./atm.js")


describe("Workouts", function(){
  beforeEach(function(){
    var me = User.create(
                          first_name: "danny",
                          last_name: "bushkanets",
                          username: "dbushy727",
                          email: "dbushy727@email.com",
                          password: "password123"
                          )
    var workout_content_panel = new WorkoutContentView()
  })
  describe("createWorkout", function(){
    it("can create an exercise for specific user", function(){
      
    })
  })
});