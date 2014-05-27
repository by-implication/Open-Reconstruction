dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);

  this.percentApproved = function(){
    return self.byLevel()[4].count / self.byLevel()[0].count;
  };

  function nextYearMonth(yearMonth){
    var ym = yearMonth.split("-");
    var y = parseInt(ym[0]);
    var m = parseInt(ym[1]);
    m++;
    if(m > 12){
      m = 1;
      y++;
    }
    return y + "-" + (m < 10 ? "0" + m : m);
  }

  function padMonths(a){
    var r = [];
    for(var ym = a[0].yearMonth; a.length; ym = nextYearMonth(ym)){
      var nextElem = {yearMonth: ym, amount: 0, count: 0};
      if(a[0].yearMonth == ym){
        nextElem = a.shift();
      }
      r.push(nextElem);
    }
    return r;
  }
  
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);
    self.byLevel(r.byLevel);
    self.byMonth(padMonths(r.byMonth));
    console.log('Disaster Types by Month:');
    console.log(r.byDisasterType);
  });

  bi.ajax(routes.controllers.Assets.at("data/yolanda.json")).then(function (r){
    console.log("Yolanda Data");
    var data = r.values.map(function(e){
      var obj = _.object(r.headers, e);
      if(!_.isUndefined(obj.Amount)){
        obj.Amount = Number.parseFloat(obj.Amount.replace(/\,/g, ""));
      }
      if(!_.isUndefined(obj.Date)){
        var dateArr = obj.Date.split("/")
        if(dateArr.length === 3){
          obj.Date = new Date(Date.parse(dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]));
        } else {
          console.log("tang ina lang. " + obj.Date);
        }
      }
      return obj;
    })
    // console.log(data);
  });

  this.c3Chart = function(elem){
    var labels = self.byMonth().map(function (e){
      var yearMonth = e.yearMonth.split("-");
      var year = yearMonth[0];
      var month = parseInt(yearMonth[1]) - 1;
      return helper.monthArray[month] + ", " + year;
    });
    var amountPerMonth = self.byMonth().map(function (e){ return e.amount / 1; });
    var countPerMonth = self.byMonth().map(function (e){ return e.count; });

    d3.locale({
      "decimal": ".",
      "thousands": ",",
      "grouping": [3],
      "currency": ["PHP", ""],
      "dateTime": "%a %b %e %X %Y",
      "date": "%m/%d/%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    })
    var chart = c3.generate({
      data: {
        x: "x",
        columns: [
          ["x"].concat(labels),
          ["Count per Month"].concat(countPerMonth),
          ["Amount per Month"].concat(amountPerMonth)
        ],
        axes: {
          "Count per Month": 'y',
          "Amount per Month": 'y2'
        },
        types: {
          "Count per Month": 'bar',
        },
      },
      color: {
        pattern: ['#555', '#ff851b']
      },
      grid: {
        x: {
          show: true
        },
        y: {
          show: true
        }
      },
      axis : {
        x : {
          type : 'timeseries',
          tick: {
            format: function (x) { 
              var monthDict = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return monthDict[x.getMonth() + 1] + ", " + x.getFullYear(); 
            }
            //format: '%Y' // format string is also available for timeseries data
          }
        },
        y2 : {
          show: true,
          tick: {
            format: function(t){
              var format =  d3.format(",")
              return "PHP " + format(t);
            }
          }
        },
      }
    });

    elem.appendChild(chart.element);

    // setTimeout(function () {
    //   window.document.body.appendChild(chart.element);
    // }, 1000);
  }

  this.d3Chart = function(elem){
    // console.log(d3.select(elem));

    var labels = self.byMonth().map(function (e){
      var yearMonth = e.yearMonth.split("-");
      var year = yearMonth[0];
      var month = parseInt(yearMonth[1]) - 1;
      return helper.monthArray[month] + ", " + year;
    });
    var amountPerMonth = self.byMonth().map(function (e){ return e.amount / 1; });
    var countPerMonth = self.byMonth().map(function (e){ return e.count; });

    // console.log(countPerMonth);
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 1260 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;
    var barHeight = 20;

    var data = countPerMonth;

    var yCount = d3.scale.linear()
      .domain([0, d3.max(countPerMonth)])
      .range([height, 0]);

    var yAmount = d3.scale.linear()
      .domain([0, d3.max(amountPerMonth)])
      .range([height, 0]);

    console.log(yAmount.range());

    var x = d3.scale.ordinal()
      .domain(labels)
      .rangePoints([0, width], 1);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
    var yAxisCount = d3.svg.axis()
      .scale(yCount)
      .orient("left");
    var yAxisAmount = d3.svg.axis()
      .scale(yAmount)
      .orient("right");

    var barWidth = width / countPerMonth.length;

    // chart
    var chart = d3.select(elem)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // axes
    chart.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(-0.5," + (height + 0.5) + ")")
      .call(xAxis);
    chart.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(-0.5, 0.5)")
      .call(yAxisCount);
    chart.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + (width - 0.5) + ", 0.5)")
      .call(yAxisAmount);

    // datapoints
    // bar
    var bar = chart.append("g")
      .selectAll("g")
        .data(countPerMonth)
        .enter()
          .append("g")
            .attr("transform", function(d, i){
              return "translate(" + i * barWidth + ",0)";
            });
    
    bar.append("rect")
      .attr("y", function(d) { 
        return yCount(d); 
      })
      .attr("height", function(d) { return height - yCount(d); })
      .attr("width", barWidth - 1);

    // line
    var line = d3.svg.line()
      .x(function(d, i){
        return x.range()[i];
      })
      .y(function(d, i){
        return yAmount(d);
      });

    chart.append("svg:path").attr("d", line(amountPerMonth));
    chart.append("g").selectAll("circle")
      .data(amountPerMonth)
      .enter()
        .append("circle")
          .attr("cx", function(d, i){
            return x.range()[i];
          })
          .attr("cy", function(d, i){
            console.log(yAmount(d));
            return yAmount(d);
          })
          .attr("r", 4);
  }

  this.chartHistory = function(elem){

    // elem.width = elem.parentNode.offsetWidth;
    // console.log(self.byMonth());
    elem.width = 1260;
    function entryToInt(entry) {
      var date = new Date(entry.date);
      return date.getFullYear() * 12 + date.getMonth();
    }

    var labels = self.byMonth().map(function (e){
      var yearMonth = e.yearMonth.split("-");
      var year = yearMonth[0];
      var month = parseInt(yearMonth[1]) - 1;
      return helper.monthArray[month] + ", " + year;
    });
    var amountPerMonth = self.byMonth().map(function (e){ return e.amount / 100000000; });
    var countPerMonth = self.byMonth().map(function (e){ return e.count; });

    var data = {
      labels: labels,
      datasets: [
        {
          fillColor : "rgba(0,0,0,0.3)",
          strokeColor : "rgba(0,0,0,0.3)",
          pointColor : "rgba(0,0,0,1)",
          pointStrokeColor : "white",
          data: countPerMonth
        },
        {
          fillColor : "#FF851B",
          strokeColor : "#FF851B",
          pointColor : "#FF851B",
          pointStrokeColor : "white",
          data: amountPerMonth
        }
      ]
    }

    var ctx = elem.getContext("2d");
    var myNewChart = new Chart(ctx).Bar(data, {
      barShowStroke: false
    });

  }

    
  this.chartDisasterHistory = function(elem){

    elem.width = Math.floor(document.body.offsetWidth * .66 - 10);

    // this is shit, ok
    // need to set width dynamically

    var data = {
      labels : ["January","February","March","April","May","June","July"],
      datasets : [
        {
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          data : [65,59,90,81,56,55,40]
        },
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          data : [28,48,40,19,96,27,100]
        }
      ]
    }

    var ctx = elem.getContext("2d");
    var myNewChart = new Chart(ctx).Bar(data, {
      bezierCurve: false
    });
  }

  this.chartDisasterPie = function(elem){

    elem.width = Math.floor(document.body.offsetWidth * .33 - 10);

    // still shit

    var data = [
      {
        value: 30,
        color:"#F38630"
      },
      {
        value : 50,
        color : "#E0E4CC"
      },
      {
        value : 100,
        color : "#69D2E7"
      }     
    ]

    var ctx = elem.getContext("2d");
    var myNewChart = new Chart(ctx).Doughnut(data, {
      bezierCurve: false
    });

  }

}
