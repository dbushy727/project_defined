

var Splash = Backbone.View.extend({
  initialize: function(){
    this.addEventListeners()
  },
  el: function(){
    return $('.sign_in_mobile')
  },
  addEventListeners: function(){
    $('.log_in_button_text_mobile').on("click", function(e){
      $('.splash_top').hide()
      $('.sign_in_form_mobile').show();
    })
  }
})

var SelectWorkout = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  render: function(){
    var self = this;
    $.ajax({
      url:      '/workouts',
      method:   'GET',
      dataType: 'json',
      success: function(data){
        var source       = $('#workout_template_mobile').html();
        var template     = Handlebars.compile(source);
        var templateData = template(data);
        $('#workout_content_mobile').append(templateData);
        self.chooseExercise();
      }
    })  
  },
  chooseExercise: function(){
    $('.select_workout').find('.select_rectangle').on("click", function(){
      console.log("clicked")
      var workout_title = $(this).find('h3').first().text()
      var workout_id = $(this).find('.workout_id').val()
      new SelectExercise({workout_id: workout_id});
      $('.select_workout').hide();
      $('.select_exercise').show();
    })
  }

})
var SelectExercise = Backbone.View.extend({
  initialize: function(params){
    var self = this;
    this.workout_id = params.workout_id
    this.render();
  },
  render: function(){
    var self = this;
    $.ajax({
      url:      '/workouts',
      method:   'GET',
      dataType: 'json',
      success: function(data){
        console.log("This is original data",data)
        console.log("This is the clicked on workout_id")
        _.each(data.workouts, function(workout){
          if (workout.id == self.workout_id) {
            data = {exercises: workout.exercises}
            var source       = $('#exercise_template_mobile').html();
            var template     = Handlebars.compile(source);
            var templateData = template(data);
            $('#exercise_content_mobile').append(templateData);
          }
        })
        
      }
    }) 
  },
  recordExercise: function(){
    $('.set_go').on("click", function() {
       var input_value = $(this).parent().find('input').val()
    })
  }

})

$(function(){
  window.select_workout = new SelectWorkout();
  window.splash_page = new Splash();

})