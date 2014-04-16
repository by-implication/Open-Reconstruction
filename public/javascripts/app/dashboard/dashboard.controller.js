dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.projects = m.prop({});
  database.pull().then(function(data){
    self.projects(database.projectList());
  })

  this.totalProjects = function(){
    return this.projects().length
  }

  this.totalProjectCost = function(){
    return helper.truncate(
      _.chain(this.projects())
      .map(function(project){
        return project.amount();
      })
      .compact()
      .reduce(function(a, b){
        return a + b;
      }, 0)
      .value()
    );
  }

  this.mostCommonProjectType = function(){
    return _.chain(this.projects())
    .countBy(function(r){
      return r.type();
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
    return _.chain(this.projects())
    .countBy(function(r){
      return r.disaster().type();
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
    var labels = [];
    var rawCount = _.chain(self.projects())
      .countBy(function(entry){
        return helper.monthArray[entry.date().getMonth()] + ", " + entry.date().getFullYear();
      });

    var rawGroup = _.chain(self.projects())
      .groupBy(function(entry){
        return helper.monthArray[entry.date().getMonth()] + ", " + entry.date().getFullYear();
      });

    var first = new Date(rawCount.keys().head().value());
    var last = new Date(rawCount.keys().last().value());
    var dateRangeObj = _.chain(first.getFullYear())
      .range(last.getFullYear() + 1)
      .map(function(year, index, list){
        if(index === 0){
          return _.range(first.getMonth(), 12).map(function(month){
            return helper.monthArray[month] + ", " + year;
          });
        } else if (index === list.length - 1){
          return _.range(0, last.getMonth() + 1).map(function(month){
            return helper.monthArray[month] + ", " + year;
          });
        } else {
          return _.range(0, 12).map(function(month){
            return helper.monthArray[month] + ", " + year;
          });
        }
      })
      .flatten();

    var countPerMonth = dateRangeObj
      .map(function(dateYear){
        return [dateYear, rawCount.value()[dateYear] ? rawCount.value()[dateYear] : 0];
      })
      .object();

    var amountPerMonth = dateRangeObj
      .map(function(dateYear){
        var projects = rawGroup.value()[dateYear]
        var amount = 0;

        if(projects){
          amount = _.chain(projects)
          .map(function(project){
            return project.amount();
          })
          .compact()
          .reduce(function(acc, next){
            return acc + next;
          }, 0)
          .value();
        }

        return [dateYear, projects ? amount * 0.00000001 : 0];
      })
      .object();

    var cpmValues = countPerMonth.values().value();
    var apmValues = amountPerMonth.values().value();
    var labels = dateRangeObj.value();

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
    // console.log(lol);
  }
}