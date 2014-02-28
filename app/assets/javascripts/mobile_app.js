

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
    this.addEventListeners()
  },

  addEventListeners: function(){
    
  }
})


$(function(){
  window.splash_page = new Splash();
})