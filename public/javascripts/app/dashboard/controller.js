dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.amountApproved = m.prop(0);
  this.approvedProjects = m.prop(0);
  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.pendingProjects = m.prop(0);
  this.totalProjectCost = m.prop(0);
  this.totalProjects = m.prop(0);
  this.byMonth = m.prop([]);

  this.percentApproved = function(){
    return self.approvedProjects() / self.totalProjects();
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
    self.amountApproved(r.amountApproved);
    self.approvedProjects(r.approvedProjects);
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);
    self.pendingProjects(r.pendingProjects);
    self.totalProjectCost(r.totalProjectCost);
    self.totalProjects(r.totalProjects);
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
    console.log(data);
  });

  this.chartInit = function(elem){
    // elem.width = document.body.offsetWidth;
    elem.width = document.body.offsetWidth;

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
          fillColor : "#FF851B",
          strokeColor : "#FF851B",
          pointColor : "#FF851B",
          pointStrokeColor : "white",
          data: amountPerMonth
        },
        {
          fillColor : "rgba(0,0,0,0.3)",
          strokeColor : "rgba(0,0,0,0.3)",
          pointColor : "rgba(0,0,0,1)",
          pointStrokeColor : "white",
          data: countPerMonth
        }
      ]
    }

    var ctx = elem.getContext("2d");
    var myNewChart = new Chart(ctx).Line(data, {
      bezierCurve: false
    });
    
  }
}
