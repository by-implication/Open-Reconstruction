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
      legend: {
        show: false
        // position: 'right'
      },
      axis : {
        x : {
          type : 'timeseries',
          tick: {
            format: function (x) { 
              var monthDict = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return monthDict[x.getMonth() + 1] + ", " + x.getFullYear(); 
            }
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
  }

  // this.chartHistory = function(elem){

  //   // elem.width = elem.parentNode.offsetWidth;
  //   // console.log(self.byMonth());
  //   elem.width = 1260;
  //   function entryToInt(entry) {
  //     var date = new Date(entry.date);
  //     return date.getFullYear() * 12 + date.getMonth();
  //   }

  //   var labels = self.byMonth().map(function (e){
  //     var yearMonth = e.yearMonth.split("-");
  //     var year = yearMonth[0];
  //     var month = parseInt(yearMonth[1]) - 1;
  //     return helper.monthArray[month] + ", " + year;
  //   });
  //   var amountPerMonth = self.byMonth().map(function (e){ return e.amount / 100000000; });
  //   var countPerMonth = self.byMonth().map(function (e){ return e.count; });

  //   var data = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         fillColor : "rgba(0,0,0,0.3)",
  //         strokeColor : "rgba(0,0,0,0.3)",
  //         pointColor : "rgba(0,0,0,1)",
  //         pointStrokeColor : "white",
  //         data: countPerMonth
  //       },
  //       {
  //         fillColor : "#FF851B",
  //         strokeColor : "#FF851B",
  //         pointColor : "#FF851B",
  //         pointStrokeColor : "white",
  //         data: amountPerMonth
  //       }
  //     ]
  //   }

  //   var ctx = elem.getContext("2d");
  //   var myNewChart = new Chart(ctx).Bar(data, {
  //     barShowStroke: false
  //   });

  // }

    
  this.chartDisasterHistory = function(elem){

    var chart = c3.generate({
      data: {
        x: "x",
        columns: [
          ["x", "January 2013","February 2013","March 2013","April 2013","May 2013","June 2013","July 2013"],
          ["Disaster 1", 65,59,90,81,56,55,40],
          ["Disaster 2", 28,48,40,19,96,27,100]
        ],
        type: 'area',
        groups: [
          ["Disaster 1", "Disaster 2"]
        ]
      },
      color: {
        pattern: ['#555', '#ff851b']
      },
      axis: {
        x : {
          type : 'timeseries',
          tick: {
            format: function (x) { 
              var monthDict = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return monthDict[x.getMonth() + 1] + ", " + x.getFullYear(); 
            }
          }
        },
      }
    });
    elem.appendChild(chart.element);
    
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
