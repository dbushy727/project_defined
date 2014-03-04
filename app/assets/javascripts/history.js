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
        console.log(data)
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

      self.visualizeDataForWorkoutOnGivenDate(exercise_id, exercise_modal_target);

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

  visualizeDataForWorkoutOnGivenDate: function(exercise, target) {
      var self = this;
      
      var path_data = [];

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%d-%m-%Y").parse;

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
          .interpolate("basis");

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

        svg.append("path")
            .datum(path_data)
            .attr("class", "line")
            .attr("d", line);
      });

    // ===============================================================================================
      // var margin = {top: 20, right: 100, bottom: 30, left: 50},
      //     width = 1000 - margin.left - margin.right,
      //     height = 500 - margin.top - margin.bottom;

      // var parseDate = d3.time.format("%Y%m%d").parse;

      // var x = d3.time.scale()
      //     .range([0, width]);

      // var y = d3.scale.linear()
      //     .range([height, 0]);

      // var color = d3.scale.category10();

      // var xAxis = d3.svg.axis()
      //     .scale(x)
      //     .orient("bottom");

      // var yAxis = d3.svg.axis()
      //     .scale(y)
      //     .orient("left");

      // var line = d3.svg.line()
      //     .interpolate("basis")
      //     .x(function(d) { return x(d.date); })
      //     .y(function(d) { return y(d.temperature); });

      // var svg = d3.select("#"+target+" .progress_line_graph").append("svg")
      //     .attr("width", width + margin.left + margin.right)
      //     .attr("height", height + margin.top + margin.bottom)
      //   .append("g")
      //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // d3.tsv("data.tsv", function(error, data) {
      //   color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

      //   data.forEach(function(d) {
      //     d.date = parseDate(d.date);
      //   });

      //   var cities = color.domain().map(function(name) {
      //     return {
      //       name: name,
      //       values: data.map(function(d) {
      //         return {date: d.date, temperature: +d[name]};
      //       })
      //     };
      //   });

      //   x.domain(d3.extent(data, function(d) { return d.date; }));

      //   y.domain([
      //     d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
      //     d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
      //   ]);

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
      //       .text("Weight (lb)");

      //   var weight = svg.selectAll(".weight")
      //       .data(cities)
      //     .enter().append("g")
      //       .attr("class", "weight");

      //   weight.append("path")
      //       .attr("class", "line")
      //       .attr("d", function(d) { return line(d.values); })
      //       .style("stroke", function(d) { return color(d.name); });

      //   weight.append("text")
      //       .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      //       .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      //       .attr("x", 3)
      //       .attr("dy", ".35em")
      //       .text(function(d) { return d.name; });
      // });

    }

}
