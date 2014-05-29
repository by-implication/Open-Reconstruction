dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);

  m.startComputation();
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);
    self.byLevel(r.byLevel);
    self.byMonth(padMonths(r.byMonth));
    self.byDisasterType(r.byDisasterType);
    console.log("Named Disasters");
    console.log(r.byNamedDisaster);
    m.endComputation();
  });

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

  this.projectHistory = new visPanel.controller();
  this.projectHistory.title("Project History");
  this.projectHistory.link("projectHistory");
  this.projectHistory.chartSettings = function(){
    var labels = _.pluck(self.byMonth(), 'yearMonth');
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
            },
            culling: {
              max: 3
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

  this.disasterHistory = new visPanel.controller();
  this.disasterHistory.title("Project History by Type");
  this.disasterHistory.link("disasterHistory");
  this.disasterHistory.chartSettings = function(){
    var data = _.chain(self.byDisasterType())
      .groupBy(function(p){
        return p.disasterTypeId;
      })
      .map(function(subData, key){
        return [key].concat(padMonths(subData).map(function(d){
          return d.count
        }));
      })
      .value();

    var range = padMonths(self.byDisasterType()).map(function(d){
      return d.yearMonth;
    });

    return {
      data: {
        x: "x",
        columns: [["x"].concat(range)].concat(data),
        type: 'area',
        groups: [
          ["Disaster 1"]
        ]
      },
      axis: {
        x : {
          type : 'timeseries',
          tick: {
            format: function (x) { 
              var monthDict = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return monthDict[x.getMonth()] + ", " + x.getFullYear(); 
            },
            culling: {
              max: 4
            }
          }
        },
      }
    }
  }

  this.projectTypes = new visPanel.controller();
  this.projectTypes.title("Project Type Distribution");
  this.projectTypes.link("projectTypes");
  this.projectTypes.chartSettings = function(){
    return {
      data: {
        columns: [
          ["Number of Projects", 3, 15, 82, 1, 42, 23]
        ],
        type: "bar",
      },
      axis: {
        x: {
          type: "categorized",
          categories: ["Rivers", "Infrastructure", "Housing", "Roads", "Phi", "Mark"]
        },
        rotated: true
      }
    }
  }

  this.topDisasters = new visPanel.controller();
  this.topDisasters.link("topDisasters");
  this.topDisasters.title("Number of Projects per Unique Named Disaster");
  this.topDisasters.chartSettings = function(){
    return {
      data: {
        columns: [
          ["Number of Projects", 3, 15, 82, 1, 42, 23]
        ],
        type: "bar",
      },
      axis: {
        x: {
          type: "categorized",
          categories: ["Rivers", "Infrastructure", "Housing", "Roads", "Phi", "Mark"]
        },
        rotated: true
      }
    }
  }

  this.topDisastersAmount = new visPanel.controller();
  this.topDisastersAmount.title("Project Amounts per Unique Named Disaster");
  this.topDisastersAmount.link("topDisastersAmount");
  this.topDisastersAmount.chartSettings = function(){
    return {
      data: {
        columns: [
          ["Number of Projects", 3, 15, 82, 1, 42, 23]
        ],
        type: "bar",
      },
      axis: {
        x: {
          type: "categorized",
          categories: ["Rivers", "Infrastructure", "Housing", "Roads", "Phi", "Mark"]
        },
        rotated: true
      }
    }
  }

  this.percentApproved = function(){
    return self.byLevel()[4].count / self.byLevel()[0].count;
  };
}
