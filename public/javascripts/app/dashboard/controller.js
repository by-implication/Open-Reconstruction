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

  this.percentApproved = function(){
    return self.approvedProjects / self.totalProjects;
  };
  
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.amountApproved(r.amountApproved);
    self.approvedProjects(r.approvedProjects);
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);
    self.pendingProjects(r.pendingProjects);
    self.totalProjectCost(r.totalProjectCost);
    self.totalProjects(r.totalProjects);
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
    function entryToInt(entry) {
      var date = new Date(entry.date);
      return date.getFullYear() * 12 + date.getMonth();
    }

    function formatDate(val) {
      var year = Math.floor(val / 12);
      var month = val % 12;
      return helper.monthArray[month] + ", " + year;
    }

    var labels = [];
    var rawGroup = _.chain(self.requests()).groupBy(entryToInt)

    var times = rawGroup.keys()
      .map(function(key) {
        return parseInt(key);
      })
      .compact()
      .sort();

    var first = times.head().value() || 0;
    var last = (times.last().value() + 1) || 0;
    var dateRangeObj = _.chain(first).range(last)

    var countPerMonth = dateRangeObj
      .map(function(dateYear){
        var projects = rawGroup.value()[dateYear]
        return projects ? projects.length : 0;
      });

    var amountPerMonth = dateRangeObj
      .map(function(dateYear){
        var projects = rawGroup.value()[dateYear]
        var amount = 0;

        if(projects){
          amount = _.chain(projects)
          .map(function(project){
            return project.amount;
          })
          .compact()
          .reduce(function(acc, next){
            return acc + next;
          }, 0)
          .value();
        }

        return projects ? amount * 0.00000001 : 0;
      });

    var cpmValues = countPerMonth.value();
    var apmValues = amountPerMonth.value();
    var labels = dateRangeObj.map(formatDate).value();

    var data = {
      labels: labels,
      datasets: [
        {
          fillColor : "#FF851B",
          strokeColor : "#FF851B",
          pointColor : "#FF851B",
          pointStrokeColor : "white",
          data: apmValues
        },
        {
          fillColor : "rgba(0,0,0,0.3)",
          strokeColor : "rgba(0,0,0,0.3)",
          pointColor : "rgba(0,0,0,1)",
          pointStrokeColor : "white",
          data: cpmValues
        }
      ]
    }

    var ctx = elem.getContext("2d");
    var myNewChart = new Chart(ctx).Line(data, {
      bezierCurve: false
    });
    
  }
}
