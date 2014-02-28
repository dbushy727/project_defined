
var Exercise = Backbone.Model.extend({
  url: '/exercise'
})

var Workout = Backbone.Model.extend({
  url: '/workout'
})

var ExerciseView = Backbone.View.extend({

})

var WorkoutView = Backbone.View.extend({

})

var ExerciseContentView = Backbone.View.extend({

  initialize: function(){
    this.collection = new ExerciseCollection();
    this.render();
    this.$new_exercise_input = $('#new_exercise_input');
    this.$add_exercise_button = $('#add_exercise_button');
    this.addEventListeners();
  },

  addEventListeners: function(){
    this.$add_exercise_button.click(this.createExercise)
  },

  createExercise: function(e){
    e.preventDefault();
    new_exercise_title = $('#new_exercise_input').val();
    data = {exercise: {title: new_exercise_title}};

    $.ajax({
      url: '/exercises',
      method: 'POST',
      dataType: 'json',
      data: data,
      success: function(data){
        console.log(data+" successfully submitted");
        exercise_content_panel.render();
      }
    })
  },

  el: function(){
    return $('#exercise_content')
  },

  render: function(){
    var self = this;

    $.ajax({
      url:      '/exercises',
      method:   'GET',
      dataType: 'json',
      success: function(data){
          $('#exercise_content').animate({opacity: 1}, 200, function(){
                                                                    $('#exercise_content').empty();

                                                                    var source   = $('#exercise_template').html()
                                                                        template     = Handlebars.compile(source),
                                                                        templateData = template(data),
                                                                        a = 3;
                                                                    
                                                                    $('#exercise_content').append(templateData);
                                                                    $('.exercise_box').draggable({

                                                                        start: function(event, ui) { $(this).css("z-index", a++); },
                                                                        revert: function(event, ui) {
                                                                          $(this).data("uiDraggable").originalPosition = {
                                                                                          top : 0,
                                                                                          left : 0
                                                                          };
                                                                          return !event;
                                                                        }
                                                                    });
                                                                  })
      }
    })
  }
})

var WorkoutContentView = Backbone.View.extend({

  initialize: function(){
    this.collection = new WorkoutCollection();
    this.render();
    this.$new_workout_input = $('#new_workout_input');
    this.$add_workout_button = $('#add_workout_button');
    this.addEventListeners();
  },

  addEventListeners: function(){
    this.$add_workout_button.click(this.createWorkout)
  },

  createWorkout: function(e){
    e.preventDefault();
    new_workout_title = $('#new_workout_input').val();
    data = {workout: {title: new_workout_title}};

    $.ajax({
      url: '/workouts',
      method: 'POST',
      dataType: 'json',
      data: data,
      success: function(data){
        console.log(data+" successfully submitted");
        workout_content_panel.render();
      }
    })
  },

  el: function(){
    return $('#workout_content')
  },

  addExerciseToWorkout: function(exercise){
    $.ajax({
      url: '/workouts/new/exercise',
      method: 'POST',
      dataType: 'json',
      data: exercise,
      success: function(data){
        console.log(data)
      }
    })
  },

  render: function(){
    var self = this;

    $.ajax({
      url:      '/workouts',
      method:   'GET',
      dataType: 'json',
      success: function(data){
        var source   = $('#workout_template').html()
        template     = Handlebars.compile(source),
        templateData = template(data);
        $('#workout_content').append(templateData);
        $('.workout_box').droppable({
                                      tolerance: "pointer",
                                      accept: ".exercise_box",
                                      activate: function( event, ui ) { $(this).addClass("light_droppable_target") },
                                      deactivate: function( event, ui ) { $(this).removeClass("light_droppable_target") },
                                      hoverClass: "droppable_target_hover",
                                      drop: function( event, ui ) { 
                                                                    var exercise = ui.draggable[0].innerText.replace(/[\n]/g, "");
                                                                    var workout  = $(this)[0].innerText.replace(/[\n]/g, "");
                                                                    var data     = {exercise: exercise,
                                                                                    workout: workout};

                                                                    self.addExerciseToWorkout(data);

                                                                    // var temporary_item = $(ui.draggable[0]).clone(true);
                                                                    $(ui.draggable[0]).animate({
                                                                      opacity: 0,
                                                                      height: "0px"
                                                                    }, 100, function(){
                                                                      ui.draggable[0].remove()
                                                                      $('.exercise_box').animate({opacity: 0},100, function(){
                                                                          $('.exercise_box').remove();
                                                                          exercise_content_panel.render()
                                                                      });
                                                                    });
                                                                    
                                                                    // $('#exercise_content').append(temporary_item);

                                                                    


                                                                  }
                                    });
      }
    })


  }

})

var ExerciseCollection = Backbone.Collection.extend({

  model: Exercise,
  url: '/exercises'
})

var WorkoutCollection = Backbone.Collection.extend({

  model: Workout,
  url: '/workouts'

})

// function getWorkouts(user_id){
//   $.ajax({
//     url: '/workouts/'+user_id,
//     method: 'GET',
//     dataType: 'json',
//     success: function(data){
//       console.log(data)
//     }
//   })
// }

// function getExercises(){
//   $.ajax({
//     url: '/exercises',
//     method: 'GET',
//     dataType: 'json',
//     success: function(data){
//       return data
//     }
//   })
// }

$(function(){
  window.exercise_content_panel = new ExerciseContentView();
  window.workout_content_panel  = new WorkoutContentView();

})