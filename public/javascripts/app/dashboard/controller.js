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

  this.d3Chart = function(elem){
    // console.log(d3.select(elem));

    var labels = self.byMonth().map(function (e){
      var yearMonth = e.yearMonth.split("-");
      var year = yearMonth[0];
      var month = parseInt(yearMonth[1]) - 1;
      return helper.monthArray[month] + ", " + year;
    });
    var amountPerMonth = self.byMonth().map(function (e){ return e.amount / 100000000; });
    var countPerMonth = self.byMonth().map(function (e){ return e.count; });

    // console.log(countPerMonth);

    var width = 960;
    var height = 200;
    var barHeight = 20;

    var data = countPerMonth;

    var yCount = d3.scale.linear()
      .domain([0, d3.max(countPerMonth)])
      .range([height, 0]);

    var yAmount = d3.scale.linear()
      .domain([0, d3.max(amountPerMonth)])
      .range([height, 0]);
    console.log(labels);
    var x = d3.scale.ordinal()
      .domain(labels)
      .rangePoints([0, width], 1);

    // console.log(x.range());

    var barWidth = width / countPerMonth.length;

    var chart = d3.select(elem)
      .attr("width", width)
      .attr("height", height);

    var bar = chart.selectAll("g")
      .data(data)
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

    // bar.append("circle")
    //   .attr("cy", function(d) {
    //     return yAmount(d);
    //   })
    //   .attr("cx", barWidth / 2)
    //   .attr("r", 2);

    var line = d3.svg.line()
      .x(function(d, i){
        return x.range()[i];
      })
      .y(function(d, i){
        return yAmount(d);
      });

    chart.append("svg:path").attr("d", line(amountPerMonth));
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
