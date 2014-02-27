function getWorkouts(user_id){
  $.ajax({
    url: '/workouts/'+user_id,
    method: 'GET',
    dataType: 'json',
    success: function(data){
      console.log(data)
    }
  })
}

function getExercises(user_id){
  $.ajax({
    url: '/exercises/'+user_id,
    method: 'GET',
    dataType: 'json',
    success: function(data){
      console.log(data)
    }
  })
}

function createWorkoutList(workout_id, exercise_id){

}
$(function(){

})
