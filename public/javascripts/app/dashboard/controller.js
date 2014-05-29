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

  this.disasterHistory = visualizations.library['disasterHistory'](self);
  this.projectTypes = visualizations.library['projectTypes'](self);
  this.topDisasters = visualizations.library['topDisasters'](self);
  this.topDisastersAmount = visualizations.library['topDisastersAmount'](self);

  this.percentApproved = function(){
    return self.byLevel()[4].count / self.byLevel()[0].count;
  };
}
