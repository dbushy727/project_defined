// 
var Exercise = Backbone.Model.extend({
  url: '/exercise'
})

var Workout = Backbone.Model.extend({
  url: '/workout'
})

var ExerciseCollection = Backbone.Collection.extend({

  model: Exercise,
  url: '/exercises'
})

var WorkoutCollection = Backbone.Collection.extend({

  model: Workout,
  url: '/workouts'

})

var ExerciseView = Backbone.View.extend({

})

var WorkoutView = Backbone.View.extend({

})

var ExerciseContentView = Backbone.View.extend({

  initialize: function(){
    var self=this
    this.collection = new ExerciseCollection();
    this.collection.bind("sync", function(){self.render()});
    this.collection.fetch()
    this.$new_exercise_input = $('#new_exercise_input');
    this.$add_exercise_button = $('#add_exercise_button');
    this.addEventListeners();
  },

  addEventListeners: function(){
    var self = this
    this.$add_exercise_button.click(function(e){self.createExercise(e)});
  },

  deleteExercise: function(e){
    var self=this
    e.preventDefault();
    var exercise_to_delete = $(e.target).parent().parent().find('span').first().text()
    window.hidden_exercise = e
    var data = {exercise: {title: exercise_to_delete}};

    $.ajax({
      url: '/exercises/:id',
      method: 'put',
      dataType: 'json',
      data: data,
      success: function(data){
        console.log(data);
        self.collection.fetch();
      }
    })

  },

  createExercise: function(e){
    e.preventDefault();
    var self = this
    var new_exercise_title = $('#new_exercise_input').val();
    $('#new_exercise_input').val("");
    var data = {exercise: {title: new_exercise_title}};

    $.ajax({
      url: '/exercises',
      method: 'POST',
      dataType: 'json',
      data: data,
      success: function(data){
        console.log(data);
        self.collection.fetch()
      }
    })
  },

  el: function(){
    return $('#exercise_content')
  },

  events: {
    "click .delete_exercise" : "deleteExercise",
  },

  render: function(){
    var self = this;
    $('#exercise_content').animate({opacity: 1}, 200, function(){
      $('#exercise_content').empty();

      var source   = $('#exercise_template').html();

      var template     = Handlebars.compile(source);
      var data = self.collection.toJSON()
      var templateData = template(data);
      var a = 3;
      
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

var WorkoutContentView = Backbone.View.extend({

  initialize: function(){
    var self = this;
    this.collection = new WorkoutCollection();
    this.render();
    this.$new_workout_input = $('#new_workout_input');
    this.$add_workout_button = $('#add_workout_button');
    this.addEventListeners();
  },

  addEventListeners: function(){
    this.$add_workout_button.click(this.createWorkout);
  },

  deleteWorkout: function(e){
    e.preventDefault();

    var workout_to_delete_id = $(e.target).closest("dd")[0].id;
    var workout_to_delete = workout_to_delete_id.replace(/(w_)/, "");
    
    var data = {workout: {title: workout_to_delete}};

    $.ajax({
      url: '/workouts/:id',
      method: 'delete',
      dataType: 'json',
      data: data,
      success: function(data){
        console.log(data);
        workout_content_panel.render();
      }
    })

  },

  createWorkout: function(e){
    e.preventDefault();
    new_workout_title = $('#new_workout_input').val();
    $('#new_workout_input').val("");
    data = {workout: {title: new_workout_title}};

    $.ajax({
      url: '/workouts',
      method: 'POST',
      dataType: 'json',
      data: data,
      success: function(data){
        console.log(data)
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

  makeWorkoutBoxDroppable: function(){
    var self = this;

    $('.workout_box').droppable({
                                  tolerance: "pointer",
                                  accept: ".exercise_box",
                                  activate: function( event, ui ) { $(this).addClass("light_droppable_target") },
                                  deactivate: function( event, ui ) { $(this).removeClass("light_droppable_target") },
                                  hoverClass: "droppable_target_hover",
                                  drop: function( event, ui ) { 
                                                                var exercise = ui.draggable[0].innerText.replace(/[\n]/g, "");
                                                                var workout  = $(this)[0].id.replace(/(w_)/, "");
                                                                var data     = {exercise: exercise,
                                                                                workout: workout};
                                                                                
                                                                self.addExerciseToWorkout(data);

                                                                // var temporary_item = $(ui.draggable[0]).clone(true);
                                                                $(ui.draggable[0]).animate({
                                                                    opacity: 0,
                                                                    height: "0px"
                                                                  }, 100, function(){
                                                                    ui.draggable[0].remove()
                                                                    $('.exercise_box').remove();
                                                                    workout_content_panel.render();
                                                                    exercise_content_panel.render();
                                                                    // $('.exercise_box').animate({opacity: 0},100, function(){
                                                                    //     $('.exercise_box').remove();
                                                                    //     workout_content_panel.render();
                                                                    //     exercise_content_panel.render();
                                                                    // });
                                                                });
                                                              }
                                });
  },

  addWorkoutSublistListeners: function(){
    var self = this;
    $('.workout_box div p i').click(function(e){
      data = {
              workout_id: e.toElement.parentElement.parentElement.parentElement.id.replace(/[a-z_]/g,""),
              exercise_name: e.toElement.parentElement.parentElement.innerText
              }
      self.unlinkExerciseFromWorkout(data);
    })
  },

  unlinkExerciseFromWorkout: function(exercise){
    $.ajax({
      url: '/workouts/unlink/exercise',
      method: 'POST',
      dataType: 'json',
      data: exercise,
      success: function(data){
        console.log("Success callback",data)
        workout_content_panel.render();
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
        
        var source       = $('#workout_template').html();
        
        var template     = Handlebars.compile(source);
        var templateData = template(data);

        // $('#workout_content').append(templateData);
        $('#workout_content').animate({opacity: 1}, 200, function(){
                                                                      $('#workout_content').empty();
                                                                      $('#workout_content').append(templateData);
                                                                      console.log("Workout content appended")
                                                                      self.$delete_workout_button = $('.delete_workout');
                                                                      self.$delete_workout_button.click(self.deleteWorkout);

                                                                      // Manage the workout list header bar
                                                                      $('.workout_box').hover(function(){
                                                                        $(this).find('.workout_dropdown').toggleClass('hide')
                                                                      });
                                                                      $('.workout_box a').click(function(){
                                                                        $(this).find('.workout_dropdown').find('i').toggleClass('fa fa-level-down')
                                                                                                                   .toggleClass('fa fa-level-up')
                                                                      });

                                                                      // Manage the workout sublist of exercises
                                                                      self.addWorkoutSublistListeners();
                                                                      $('.workout_box div p').hover(function(){
                                                                        $(this).first().find('.unlink_exercise_from_workout').toggleClass('hide')
                                                                      })

                                                                      // Make the panel droppable
                                                                      // TODO: the drop down element isn't also droppable right now
                                                                      workout_content_panel.makeWorkoutBoxDroppable()
                                                                    });

        
      }
    })


  }

})




var otterWatch = function(){
  jwerty.key('option+o',function(){
    $('#do_it_for_timmy').toggleClass('hide')
  });
}

var otterSwitch = function(){
  jwerty.key('option+space',function(){
    var otter_number_list   = [1,2,3,4,5,6];
    var otter_name_list     = ["Timmy","Susan","Mickey","Sammy","Emmit","Kimmie"];
    var chosen_otter_name   = _.sample(otter_name_list, 1);
    var chosen_otter_number = _.sample(otter_number_list, 1);
    var template = "<img src='/assets/otters/otter_"+chosen_otter_number+".jpg'>";
    $('#otter_image').html("");
    $('#otter_box').text("");
    $('#otter_image').html(template);
    $('#otter_box').text("Do it for "+chosen_otter_name+"!")
  })
}

$(function(){

  switch (window.location.pathname){
    case "/":
      window.exercise_content_panel = new ExerciseContentView();
      window.workout_content_panel  = new WorkoutContentView();
      otterWatch();
      otterSwitch();
      break;
    case "/history":
      // window.history_table = new HistoryTable();
      workoutHistory.historyHeatmap();
      break;
  }

})

