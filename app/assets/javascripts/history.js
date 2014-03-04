var workoutHistory = {

  initialize: function(){
    this.historyHeatmap()
  },

  historyHeatmap: function(){
    var self = this;

    // Calendar heatmap of workout history
    var cal = new CalHeatMap();

    // Calculate space available for heatmap months
    var month_space = Math.floor($(window).width()/317.5)

      // Set start date for calendar to month_space months prior to the present date
      var d = new Date();
      d.setMonth(d.getMonth()-(month_space-1));

    cal.init({
      domain: "month",
      data: '/workouts/history',
      subDomain: "x_day",
      itemName: ["set", "sets"],
      subDomainTitleFormat: {
                            empty: "No workouts recorded on this date"
                            },
                            start: d,
      highlight: ["now"],
      legendVerticalPosition: "center",
      legendOrientation: "vertical",
      legendMargin: [0, 10, 0, 0],
      cellSize: 20, subDomainTextFormat: "%d",
      range: month_space,
      tooltip: true,
      displayLegend: true,
      domainMargin: 10

      });

  // getDate()       // Returns the date
  // getMonth()     // Returns the month
  // getFullYear() // Returns the year

  // Date format needs to match ActiveRecord: "created_at" = '2014-03-02 20:53:37'

    $('.recent_workout_history g').click(function(e) {
                                          var date_time = e.target.__data__['t'];
                                          var date = new Date(date_time);
                                          var formatted_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                                          self.getWorkoutData(formatted_date)
                                        })
  },

  getWorkoutData: function(data) {
    var self = this;
    var date_hash = {date: data};

    $.ajax({
      url: '/workouts/session',
      method: 'post',
      data: date_hash,
      success: function(data){
        // console.log(data)
        self.renderDayData(data)
      }
    })
  },

  renderDayData: function(data){
    var self         = this;
    var source       = $('#day_data_template').html();
    var template     = Handlebars.compile(source);
    var templateData = template(data);
    $('#data_table').empty();
    $('#data_table').append(templateData);

    $('.exercise_name').find('a').click(function(e){
      e.preventDefault();
      var exercise_id = $(this)[0].attributes[1].value;
      var exercise_modal_target = $(this)[0].attributes[2].value;
      self.visualizeDataForWorkoutOnGivenDate(exercise_id);
    })

  },

  visualizeDataForWorkoutOnGivenDate: function(exercise) {
      // var path_data = [];

      // var margin = {top: 20, right: 20, bottom: 30, left: 50},
      //     width = 960 - margin.left - margin.right,
      //     height = 500 - margin.top - margin.bottom;

      // var parseDate = d3.time.format("%d-%m-%Y").parse;

      // var x = d3.time.scale()
      //     .range([0, width]);

      // var y = d3.scale.linear()
      //     .range([height, 0]);

      // var xAxis = d3.svg.axis()
      //     .scale(x)
      //     .orient("bottom");

      // var yAxis = d3.svg.axis()
      //     .scale(y)
      //     .orient("left");

      // var line = d3.svg.line()
      //     .x(function(d) { return x(d.created_at); })
      //     .y(function(d) { return y(d.total_reps); });

      // var svg = d3.select("#progress_line_graph").append("svg")
      //     .attr("width", width + margin.left + margin.right)
      //     .attr("height", height + margin.top + margin.bottom)
      //   .append("g")
      //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // d3.json("exercise/"+exercise+"/history", function(error, json) {
      //   var data = json.data.exercise_history;
      //   if (error) return console.warn(error);
      //   data.forEach(function(d){
      //     console.log(d)
      //     var date     = new Date(d.created_at);
      //     d.created_at = parseDate(date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear());
      //     d.total_reps = +d.total_reps;
      //   });

      //   x.domain(d3.extent(data, function(d) { return d.created_at; }));
      //   y.domain(d3.extent(data, function(d) { return d.total_reps; }));

      //   svg.append("g")
      //       .attr("class", "x axis")
      //       .attr("transform", "translate(0," + height + ")")
      //       .call(xAxis);

      //   svg.append("g")
      //       .attr("class", "y axis")
      //       .call(yAxis)
      //     .append("text")
      //       .attr("transform", "rotate(-90)")
      //       .attr("y", 6)
      //       .attr("dy", ".71em")
      //       .style("text-anchor", "end")
      //       .text("Reps");

      //   data.forEach(function(d){
      //     var data_set = {
      //                 created_at: d.created_at,
      //                 total_reps: d.total_reps
      //                 }
      //     path_data.push(data_set)
      //   })

      //   svg.append("path")
      //       .datum(path_data)
      //       .attr("class", "line")
      //       .attr("d", line);
      // });

// =========================================================================

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%d-%b-%y").parse;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d.created_at); })
          .y(function(d) { return y(d.reps); });

      var svg = d3.select("#progress_line_graph").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.json("exercise/"+exercise+"/history", function(error, data) {
        var data = data.data['exercise_history']
        data.forEach(function(d) {
          var date     = new Date(d.created_at);
          d.created_at = date.getDate()+'-'+date.getMonth()+ '-' + date.getFullYear()
          d.reps = +d.total_reps;
          console.log("Created at: ",d.created_at)
          console.log("Reps: ",d.reps)
        });

        x.domain(d3.extent(data, function(d) { return d.created_at; }));
        y.domain(d3.extent(data, function(d) { return d.reps; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Total Reps");

        console.log(data)

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
      });


    }

}

