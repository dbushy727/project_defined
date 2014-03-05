var workoutHistory = {

  initialize: function(){
    this.historyHeatmap()
  },

  modalWatcher: function(){
    $('.reveal-modal').data('reveal-init', {
        animation: 'fadeAndPop',
        animation_speed: 250,
        close_on_background_click: false,
        close_on_esc: false,
        dismiss_modal_class: 'close-reveal-modal',
        bg_class: 'reveal-modal-bg',
        bg : $('.reveal-modal-bg'),
        css : {
            open : {
                'opacity': 0,
                'visibility': 'visible',
                'display' : 'block'
            },
            close : {
                'opacity': 1,
                'visibility': 'hidden',
                'display': 'none'
            }
        }
    });
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

  // getDate()      // Returns the date
  // getMonth()    // Returns the month
  // getFullYear() // Returns the year

  // Date format needs to match ActiveRecord: "workout_date" = '2014-03-02 20:53:37'

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
    var self        = this;
    var source      = $('#day_data_template').html();
    var template    = Handlebars.compile(source);
    var templateData = template(data);
    // console.log(data)
    $('#data_table').empty();
    $('#data_table').append(templateData);
    self.modalWatcher()

    $('.exercise_name').find('a').click(function(e){
      e.preventDefault();
      var exercise_id = $(this)[0].attributes[1].value;
      var exercise_modal_target = $(this)[0].attributes[2].value;
      $('#'+exercise_modal_target).foundation('reveal', 'open');

      // Default historical display
      self.visualizeExerciseWeightHistory(exercise_id, exercise_modal_target);
      

      $('.dataset_link').click(function(e){
        switch (e.target.innerText) {
          case "Reps":
            $('.progress_line_graph').empty();
            self.visualizeExerciseRepHistory(exercise_id, exercise_modal_target);
            break;
          case "Weights":
            $('.progress_line_graph').empty();
            self.visualizeExerciseWeightHistory(exercise_id, exercise_modal_target);
            break;
          default:
            $('.progress_line_graph').empty();
            self.visualizeExerciseWeightHistory(exercise_id, exercise_modal_target);
            break;
        }

      });

      $('a.close-reveal-modal').click(function(e){
        $('#'+exercise_modal_target).foundation('reveal', 'close');
        $('a.close-reveal-modal').unbind('click');
        // Removes the graph from the DOM
        $("#"+exercise_modal_target+" .progress_line_graph svg").remove();
      });

      // Puts an event listener on the window to close the modal
      $(window).click(function(e){
        if (e.target.attributes.class.value == "reveal-modal-bg"){
          $('#'+exercise_modal_target).foundation('reveal', 'close');
          // Removes the event listener on window close
          $(window).unbind('click');
          // Removes the graph from the DOM
          $("#"+exercise_modal_target+" .progress_line_graph svg").remove();
        }
      })
    })

  },

  dynamicSort: function(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
  },

  visualizeExerciseRepHistory: function(exercise, target) {
      var self = this;

      var path_data = [];

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%d-%m-%Y").parse,
          bisectDate = d3.bisector(function(d) { return d.workout_date; }).left;

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
          .x(function(d) { return x(d.workout_date); })
          .y(function(d) { return y(d.total_reps); })
          .interpolate("step-before");

      var svg = d3.select("#"+target+" .progress_line_graph").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      d3.json("exercise/"+exercise+"/history", function(error, json) {
        var data = json.data.exercise_history;
        if (error) return console.warn(error);

        data = data.sort(self.dynamicSort("workout_date"))

        data.forEach(function(d){
          var date    = new Date(d.workout_date);
          // console.log("Date",date)
          d.workout_date = parseDate(date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear());
          // console.log("Actual set date",d.workout_date)
          d.total_reps = +d.total_reps;
          
        });

        x.domain(d3.extent(data, function(d) { return d.workout_date;}));
        y.domain(d3.extent(data, function(d) { return d.total_reps; }));

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
            .text("Reps");

        data.forEach(function(d){
          var data_set = {
                          workout_date: d.workout_date,
                          total_reps: d.total_reps
                          }
          path_data.push(data_set)
        })

        // console.log(path_data)

        var path = svg.append("path")
            .datum(path_data)
            .attr("class", "line")
            .attr("d", line);

        var totalLength = path.node().getTotalLength();
        
        path
            .attr("stroke-dasharray", totalLength+","+totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
              .duration(1200)
              .ease("linear-in-out")
              .attr("stroke-dashoffset", 0);

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5);

        focus.append("text")
            .attr("x", -15)
            .attr("dy", "-1em");

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
          // console.log(x.invert(d3.mouse(this)[0]))
          var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(path_data, x0, 1),
              d0 = path_data[i - 1],
              d1 = path_data[i],
              d = x0 - d0.workout_date > d1.workout_date - x0 ? d1 : d0;

          focus.attr("transform", "translate(" + x(d.workout_date) + "," + y(d.total_reps) + ")");
          focus.select("text").text(d.total_reps+" reps");
        }

      });

    },

    visualizeExerciseWeightHistory: function(exercise, target) {
        var self = this;

        var path_data = [];

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%d-%m-%Y").parse,
            bisectDate = d3.bisector(function(d) { return d.workout_date; }).left;

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

        var weighted_average_line = d3.svg.line()
            .x(function(d) { return x(d.workout_date); })
            .y(function(d) { return y(d.weighted_average); });
            // .interpolate("cardinal");

        var highest_weight_line = d3.svg.line()
            .x(function(d) { return x(d.workout_date); })
            .y(function(d) { return y(d.highest_weight); });

        var lowest_weight_line = d3.svg.line()
            .x(function(d) { return x(d.workout_date); })
            .y(function(d) { return y(d.lowest_weight); });

        var svg = d3.select("#"+target+" .progress_line_graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        d3.json("exercise/"+exercise+"/history", function(error, json) {
          var data = json.data.exercise_history;
          if (error) return console.warn(error);

          // Sorts data ascending by workout date
          data = data.sort(self.dynamicSort("workout_date"))

          data.forEach(function(d){
            var date          = new Date(d.workout_date);
            d.workout_date    = parseDate(date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear());
            d.weighted_average  = +d.weighted_average;
            d.lowest_weight   = +d.lowest_weight;
            d.highest_weight  = +d.highest_weight; 
          });

          x.domain(d3.extent(data, function(d) { return d.workout_date;}));
          y.domain(d3.extent(data, function(d) { return d.weighted_average; }));

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
              .text("Weight (lbs)");

          data.forEach(function(d){
            var data_set = {
                            workout_date:     d.workout_date,
                            weighted_average: d.weighted_average,
                            lowest_weight:    d.lowest_weight,
                            highest_weight:   d.highest_weight
                            }
            path_data.push(data_set)
          })

          // console.log(path_data)

          var weighted_average_path = svg.append("path")
              .datum(path_data)
              .attr("class", "line weighted_average")
              .attr("d", weighted_average_line);

          var highest_weight_path = svg.append("path")
              .datum(path_data)
              .attr("class", "line highest_weight")
              .attr("d", highest_weight_line);

          var lowest_weight_path = svg.append("path")
              .datum(path_data)
              .attr("class", "line lowest_weight")
              .attr("d", lowest_weight_line);

          var weighted_totalLength = weighted_average_path.node().getTotalLength();
          
          weighted_average_path
              .attr("stroke-dasharray", weighted_totalLength+","+weighted_totalLength)
              .attr("stroke-dashoffset", weighted_totalLength)
              .transition()
                .duration(1500)
                .ease("linear-in-out")
                .attr("stroke-dashoffset", 0);

          // var highest_weight_totalLength = highest_weight_path.node().getTotalLength();
          
          // highest_weight_path
          //     .transition()
          //       .duration(5000)
          //       .ease("in");

          // var lowest_weight_totalLength = lowest_weight_path.node().getTotalLength();
          
          // lowest_weight_path
          //     .attr("stroke-dasharray", lowest_weight_totalLength+","+lowest_weight_totalLength)
          //     .attr("stroke", lowest_weight_totalLength)
          //     .transition()
          //       .duration(2000)
          //       .ease("in")
          //       .attr("stroke", 0);

          var focus = svg.append("g")
              .attr("class", "focus")
              .style("display", "none");

          focus.append("circle")
              .attr("r", 4.5);

          d3.select('.average').append("text");
          d3.select('.highest').append("text");
          d3.select('.lowest').append("text");

          svg.append("rect")
              .attr("class", "overlay")
              .attr("width", width)
              .attr("height", height)
              .on("mouseover", function() { focus.style("display", null); })
              .on("mouseout", function() { focus.style("display", "none"); })
              .on("mousemove", mousemove);

          function mousemove() {
            // console.log(x.invert(d3.mouse(this)[0]))
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(path_data, x0, 1),
                d0 = path_data[i - 1],
                d1 = path_data[i],
                d = x0 - d0.workout_date > d1.workout_date - x0 ? d1 : d0;

            focus.attr("transform", "translate(" + x(d.workout_date) + "," + y(d.weighted_average) + ")");
            d3.select('.average').select("text").text("Average weight: "+d3.round(d.weighted_average, 0)+" lbs");
            d3.select('.highest').select("text").text("Max Weight: "+d3.round(d.highest_weight, 0)+" lbs");
            d3.select('.lowest').select("text").text("Min Weight: "+d3.round(d.lowest_weight, 0)+" lbs");
          }

        });
    }

}
