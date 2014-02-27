
var Exercise = Backbone.Model.extend({

})

var Workout = Backbone.Model.extend({

})

var ExerciseView = Backbone.View.extend({
  template: function(attrs){
    var html_string = "<div class='exercise_box'><h3 class='exercise_name'></h3></div>"
    var template_func = _.template(html_string)
    return template_func(attrs)
  },
  render: function(){
    var self = this;
    this.$el.html(this.template(this.model.attributes))
  }

})

var WorkoutView = Backbone.View.extend({

})

var ExerciseContentView = Backbone.View.extend({
  
  initialize: function(){
    this.collection = new ExerciseCollection();
    this.listenTo(this.collection, "all", this.render);
    this.collection.fetch();
    this.views = []
  },

  el: function(){
    return $('#exercise_content')
  },

  render: function(){
    var self = this;

    _.each(this.views, function(view){
      view.remove()
    })

    _.each(this.collection.models,function(exercise){
      var exercise_view = new ExerciseView({
        model: exercise
      });

      self.$el.append(exercise_view.$el)
      self.views.push(exercise_view)
    })
  }
})

var WorkoutContentView = Backbone.View.extend({
  el: function(){
    return $('#workout_content')
  }
})

var ExerciseCollection = Backbone.Collection.extend({

  model: Exercise,
  url: '/exercises'
})

var WorkoutCollection = Backbone.Collection.extend({

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

  
  

  $(function(){
    // var exercise_content_panel = new ExerciseContentView()
  })
