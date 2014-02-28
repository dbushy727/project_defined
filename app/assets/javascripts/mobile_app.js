

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
      }
    })  
  }
})
var SelectExercise = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  render: function(){
    var self = this;
    $.ajax({
      url:      '/exercises',
      method:   'GET',
      dataType: 'json',
      success: function(data){
        var source       = $('#exercise_template_mobile').html();
        var template     = Handlebars.compile(source);
        var templateData = template(data);
        $('#exercise_content_mobile').append(templateData);
      }
    }) 
  }

})

$(function(){
  window.select_workout = new SelectWorkout();
  window.select_exercise = new SelectExercise();
  window.splash_page = new Splash();

})