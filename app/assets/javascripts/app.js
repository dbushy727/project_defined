
var Exercise = Backbone.Model.extend({

})

var Workout = Backbone.Model.extend({

})

var ExerciseView = Backbone.View.extend({

})

var WorkoutView = Backbone.View.extend({

})

var ExerciseContentView = Backbone.View.extend({
  
  initialize: function(){
    this.collection = new ExerciseCollection();
    this.render();
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
        var source   = $('#exercise_template').html()
        template     = Handlebars.compile(source),
        templateData = template(data);
        // console.log(data)
        $('#exercise_content').append(templateData);
        $('.exercise_box').draggable({
          revert : function(event, ui) {
            $(this).data("uiDraggable").originalPosition = {
                            top : 0,
                            left : 0
          };
            return !event;
          }
        });
      }
    })
  }
})

var WorkoutContentView = Backbone.View.extend({

  initialize: function(){
    this.collection = new WorkoutCollection();
    this.render();
  },

  el: function(){
    return $('#workout_content')
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
                                      drop: function() {
                                        console.log( "dropped" );
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

function getExercises(){
  $.ajax({
    url: '/exercises',
    method: 'GET',
    dataType: 'json',
    success: function(data){
      return data
    }
  })
}


  
  

$(function(){
  window.exercise_content_panel = new ExerciseContentView();
  window.workout_content_panel  = new WorkoutContentView();

})

