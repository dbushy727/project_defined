
var HistoryTable = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  render: function(){
    var self = this;
    $.ajax({
      url:      '/history',
      method:   'GET',
      dataType: 'json',
      success: function(data){
        var source       = $('#exercise_instance_template').html();
        var template     = Handlebars.compile(source);
        var templateData = template(data);
        $('#data_table').find('tbody').append(templateData);
      }
    })  
  }
})