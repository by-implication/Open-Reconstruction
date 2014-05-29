dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.requests = m.prop([]);
  
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.requests(r);
  });

  this.pendingProjects = function(){
    return this.totalProjects() - this.approvedProjects().length;
  }

  this.approvedProjects = function(){
    return this.requests().filter(function (r){
      return r.level >= process.levelDict.indexOf("OP_SIGNOFF");
    });
  }

  this.totalProjects = function(){
    return this.requests().length
  }

  this.percentApproved = function(){
    return this.approvedProjects().length / this.totalProjects();
  }

  this.amountApproved = function(){
    return this.approvedProjects()
      .map(function (r){ return r.amount; })
      .reduce(function (a, b){ return a + b; }, 0);
  }

  this.totalProjectCost = function(){
    return helper.truncate(
      _.chain(this.requests())
      .map(function(project){
        return project.amount;
      })
      .compact()
      .reduce(function(a, b){
        return a + b;
      }, 0)
      .value()
    );
  }

  this.mostCommonProjectType = function(){
    return _.chain(this.requests())
    .countBy(function(r){
      return r.projectType;
    })
    .pairs()
    .reject(function(p){
      return p[0] == "OTHERS";
    })
    .max(function(r){
      return r[1];
    })
    .value();
  }

  this.mostCommonDisasterType = function(){
    return _.chain(this.requests())
    .countBy(function(r){
      return r.disasterType;
    })
    .pairs()
    .reject(function(p){
      return p[0] == "OTHERS";
    })
    .max(function(r){
      return r[1];
    })
    .value();
  }

  this.chartInit = function(elem){
    // elem.width = document.body.offsetWidth;
    elem.width = 1280;
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
