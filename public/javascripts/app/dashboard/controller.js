dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);

  this.projectHistory2 = new visPanel.controller();
  this.projectHistory2.title("Project History");
  this.projectHistory2.chartSettings = function(){
    var labels = self.byMonth().map(function (e){
      var yearMonth = e.yearMonth.split("-");
      var year = yearMonth[0];
      var month = parseInt(yearMonth[1]) - 1;
      return helper.monthArray[month] + ", " + year;
    });
    var amountPerMonth = self.byMonth().map(function (e){ return e.amount / 1; });
    var countPerMonth = self.byMonth().map(function (e){ return e.count; });

    return {
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
        }
      },
      axis : {
        x : {
          type : 'timeseries',
          tick: {
            format: function (x) { 
              var monthDict = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return monthDict[x.getMonth()] + ", " + x.getFullYear(); 
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
    }
  }

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
  // m.computationStart();
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);
    self.byLevel(r.byLevel);
    self.byMonth(padMonths(r.byMonth));
    self.byDisasterType(r.byDisasterType);
    // m.computationEnd();
    // console.log('Disaster Types by Month:');
    // console.log(r.byDisasterType);
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

  this.projectHistory = function(elem){
    var labels = self.byMonth().map(function (e){
      var yearMonth = e.yearMonth.split("-");
      var year = yearMonth[0];
      var month = parseInt(yearMonth[1]) - 1;
      return helper.monthArray[month] + ", " + year;
    });
    var amountPerMonth = self.byMonth().map(function (e){ return e.amount / 1; });
    var countPerMonth = self.byMonth().map(function (e){ return e.count; });

    var chart = c3.generate({
      // size: {
      //   height: 240,
      //   width: 320
      // },
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
              return monthDict[x.getMonth()] + ", " + x.getFullYear(); 
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

    
  this.chartDisasterHistory = function(elem){

    var data = _.chain(self.byDisasterType())
      .groupBy(function(p){
        return p.disasterTypeId;
      })
      .map(function(subData, key){
        return [key]
          .concat(padMonths(subData).map(function(d){
            return d.count
          }));
      })
      .value();

    var range = padMonths(self.byDisasterType()).map(function(d){
      return d.yearMonth;
    })

    var chart = c3.generate({
      data: {
        x: "x",
        columns: [["x"].concat(range)].concat(data),
        type: 'area',
        groups: [
          ["Disaster 1"]
        ]
      },
      grid: {
        x: {
          show: true
        },
        y: {
          show: true
        }
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
              return monthDict[x.getMonth()] + ", " + x.getFullYear(); 
            }
          }
        },
      }
    });
    elem.appendChild(chart.element);
  }
  
  this.chartProjectTypes = function(elem){
    var chart = c3.generate({
      data: {
        columns: [
          ["Number of Projects", 3, 15, 82, 1, 42, 23]
        ],
        type: "bar",
      },
      legend: {
        show: false
      },
      color: {
        pattern: ['#ff851b']
      },
      axis: {
        x: {
          type: "categorized",
          categories: ["Rivers", "Infrastructure", "Housing", "Roads", "Phi", "Mark"]
        },
        rotated: true
      }
    })
    elem.appendChild(chart.element);
  }

}
